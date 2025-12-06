const module = {
  _id: "M101",
  name: "Introduction to Rocket Propulsion",
  description: "Basic principles of rocket propulsion and rocket engines.",
  course: "RS101",
};
export default function WorkingWithModule(app) {
  const getModule = (req, res) => {
    res.json(module);
  };
  const getModuleName = (req, res) => {
    res.json(module.name);
  };
  const setModuleName = (req, res) => {
    const { newName } = req.params;
    module.name = newName;
    res.json(module);
  };

  const setModuleDescription = (req, res) => {
    const { newDesc } = req.params;
    module.description = newDesc;
    res.json(module);
  };

  app.get("/lab5/module/name/:newName", setModuleName);
  app.get("/lab5/module/description/:newDesc", setModuleDescription);

  app.get("/lab5/module/name", getModuleName);

  app.get("/lab5/module", getModule);
}
