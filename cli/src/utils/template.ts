export interface TemplateVariables {
  projectName: string;
  [key: string]: string | boolean | string[];
}

export function processTemplate(
  content: string,
  variables: TemplateVariables
): string {
  let result = content;

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    const stringValue = Array.isArray(value) ? value.join(', ') : String(value);
    result = result.replace(placeholder, stringValue);
  }

  return result;
}

export function isTemplateFile(filename: string): boolean {
  return filename.endsWith('.tmpl');
}

export function getOutputFilename(templateFilename: string): string {
  if (isTemplateFile(templateFilename)) {
    return templateFilename.slice(0, -5);
  }
  return templateFilename;
}
