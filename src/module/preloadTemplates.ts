import CONSTANTS from "./constants";

export const preloadTemplates = async function (): Promise<Handlebars.TemplateDelegate<any>[]> {
  const templatePaths = [
    // Add paths to "modules/senses/templates"
    // `modules/${CONSTANTS.MODULE_NAME}/templates/extra_senses.html`,
  ];
  return loadTemplates(templatePaths);
};
