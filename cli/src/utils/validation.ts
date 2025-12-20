import { join } from 'node:path';
import { featureDefinitions } from '../features';
import { listDirEntries, pathExists } from './fs';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export async function validateFeatureTemplates(templatesDir: string): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const featuresDir = join(templatesDir, 'features');

  if (!(await pathExists(featuresDir))) {
    return {
      valid: false,
      errors: ['Features directory does not exist: ' + featuresDir],
      warnings: [],
    };
  }

  const templateDirs = new Set<string>();
  const entries = await listDirEntries(featuresDir);

  for (const entry of entries) {
    if (entry.isDirectory) {
      const subPath = join(featuresDir, entry.name);
      const subEntries = await listDirEntries(subPath);

      const hasOnlyDirs = subEntries.every(e => e.isDirectory);
      const isNestedBundle = hasOnlyDirs && subEntries.length > 0;

      if (isNestedBundle && entry.name === 'ui-bundles') {
        for (const subEntry of subEntries) {
          if (subEntry.isDirectory) {
            templateDirs.add(`features/${entry.name}/${subEntry.name}`);
          }
        }
      } else {
        templateDirs.add(`features/${entry.name}`);
      }
    }
  }

  for (const [featureId, feature] of Object.entries(featureDefinitions)) {
    if (feature.templatePath === null) {
      continue;
    }
    if (!templateDirs.has(feature.templatePath)) {
      errors.push(`Feature "${featureId}" declares template "${feature.templatePath}" but folder is missing`);
    }
  }

  const declaredPaths = new Set(
    Object.values(featureDefinitions)
      .filter(f => f.templatePath !== null)
      .map(f => f.templatePath)
  );
  for (const templateDir of templateDirs) {
    if (!declaredPaths.has(templateDir)) {
      warnings.push(`Template folder "${templateDir}" exists but no feature declares it`);
    }
  }

  for (const [featureId, feature] of Object.entries(featureDefinitions)) {
    if (feature.templatePath === null) {
      continue;
    }

    const templateFullPath = join(templatesDir, feature.templatePath);

    if (!(await pathExists(templateFullPath))) {
      continue;
    }

    for (const file of feature.files) {
      const filePath = join(templateFullPath, file);
      if (!(await pathExists(filePath))) {
        errors.push(`Feature "${featureId}" declares file "${file}" but it's missing`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function formatValidationResult(result: ValidationResult): string {
  const lines: string[] = [];

  if (result.errors.length > 0) {
    lines.push('Errors:');
    for (const error of result.errors) {
      lines.push(`  ✗ ${error}`);
    }
  }

  if (result.warnings.length > 0) {
    lines.push('Warnings:');
    for (const warning of result.warnings) {
      lines.push(`  ⚠ ${warning}`);
    }
  }

  if (result.valid && result.warnings.length === 0) {
    lines.push('✓ All features and templates are valid');
  }

  return lines.join('\n');
}
