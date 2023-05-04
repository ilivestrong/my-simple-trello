# my-simple-trello
GraphQL APIs assessment test for BRIKL. This GraphQL server is built using Apollo Server implementation.  
#### *NOTE*: Unit tests are included in this repo, but due to shortage of time, integration tests weren't.  


## Steps to run
1. Clone the repo on your local machine.

2. Now, CD into the root folder >> **my-simple-trello** 

3. To run the service, run below command on terminal:
    ```
     >> npm start
    ```
    This will run the service, and the prompt will show the endpoint where ther service is running and available, like example below
    ```
    >> trello server running at: http://localhost:4000/
    ```  

4. Open browser and type endpoint addres where Apollo GraphQL server would allow you to query and mutate data using the APIs.  

5. There is one `query` type called `lists`, which returns all created lists with any created tasks inside them and can be invoked as shown in example below:
```
query ExampleQuery($input: PaginateInfo) {
  lists(input: $input) {
    id
    title
    tasks {
      id
      title
      position
    }
  }
}

Input variables (support pagination):
{
  "input": {
    "skip": 0,
    "take": 10
  }
}
```

7. There are 4 `nutations` types called:
- `createList`
- `createTask`
- `updateTask`
- `moveTask`

```
mutation createList($title: String!) {
  createList(title: $title) {
    id,
    title
  }
}

Variable
{
  "title": "My Todo List"
}
```

```
mutation createTask($title: String!, $listId: Int!) {
  createTask(title: $title, listID: $listId) {
    id,
    completed,
    position
  }
}

Variables  
{
  "title": "Grocery shopping",
  "listId": 1
}
```

```
mutation updateTask($title: String!, $completed: Boolean!, $taskId: Int!) {
  updateTask(title: $title, completed: $completed, taskID: $taskId) {
    id,
    title
  }
}

Variables
{
  "title": "Grocery shopping - done",
  "completed": true,
  "taskId": 1
}
```

```
mutation moveTask($taskId: Int!, $listId: Int!, $newPosition: Int!) {
  moveTask(taskID: $taskId, listID: $listId, newPosition: $newPosition) {
    id,
    title
    completed
    position
  }
}

Variables
{
  "taskId": 1,
  "listId": 1,
  "newPosition": 2
}
```  

6. To run tests, run below command on terminal:
```
>> npm run test
``` 