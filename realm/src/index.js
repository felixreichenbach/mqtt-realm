const Realm = require("realm");
const BSON = require("bson");
const mqtt = require('mqtt')

// Update this with your App ID
const app = new Realm.App({ id: process.env.REALM_APPID });

const TaskSchema = {
  name: "Task",
  properties: {
    _id: "objectId",
    _partition: "string?",
    name: "string",
    status: "string",
  },
  primaryKey: "_id",
};


async function run() {

  const credentials = Realm.Credentials.anonymous();
  await app.logIn(credentials);
  console.log(`Logged in anonymously with user id: ${app.currentUser.id}`);

  const realm = await Realm.open({
    schema: [TaskSchema],
    sync: {
      user: app.currentUser,
      partitionValue: "quickstart",
    },
  }).then((realm)=>{
    client = mqtt.connect('mqtt://mqtt:1883')
    client.on('connect', function () {
      console.log("connect")
      client.subscribe('presence', function (err) {
        if (!err) {
          client.publish('presence', 'Hello mqtt')
        }
      })
    })
    
    client.on('message', function (topic, message) {
      // message is Buffer
      console.log(message.toString())
    
      realm.write(() => {
        console.log("write")
        const task1 = realm.create("Task", {
          _id: new BSON.ObjectID(),
          name: message.toString(),
          status: "Open",
        });
      });
    });

    // Get all Tasks in the realm
    const tasks = realm.objects("Task");

    // Add a listener that fires whenever one or more Tasks are inserted, modified, or deleted.
    tasks.addListener(taskListener);
  });

  // Clean up and shutdown application
  process.on('SIGINT', () => {
    tasks.removeListener(taskListener);
    realm.close();
    app.currentUser.logOut();
    client.end()
    console.log("Cleaned up and shutting down")
    process.exit(0)
  })

}
run().catch(err => {
  console.error(err)
});

// Define the collection notification listener
function taskListener(tasks, changes) {
  // Update UI in response to deleted objects
  changes.deletions.forEach((index) => {
    // Deleted objects cannot be accessed directly,
    // but we can update a UI list, etc. knowing the index.
    console.log(`- deleted a task -`);
  });

  // Update UI in response to inserted objects
  changes.insertions.forEach((index) => {
    let insertedTask = tasks[index].name;
    console.log(`inserted task: ${JSON.stringify(insertedTask, null, 2)}`);
    // ...
  });

  // Update UI in response to modified objects
  changes.newModifications.forEach((index) => {
    let modifiedTask = tasks[index];
    console.log(`modified task: ${JSON.stringify(modifiedTask, null, 2)}`);
    // ...
    client.publish('presence', 'Task Modified by MQTT')

  });
}