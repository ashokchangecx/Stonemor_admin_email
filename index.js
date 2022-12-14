const server = require("./server");

const port = 5100;

server
  .create()
  .then((app) => {
    app.listen(port, () => {
      console.log(`Server has started on port ${port}!`);
    });
  })
  .catch((err) => console.log(err));
