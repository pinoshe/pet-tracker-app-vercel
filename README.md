# Rokak Development Task

This is the Rokak™ development task.
It includes a boilerplate of a basic React application with a map component.

It is based on [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/) and [mapLibre](https://maplibre.org/) (based on Mapbox GL).

## Local Environment

### Setting up

**Install prerequisites**

Make sure you have Node.js 14 or higher installed on your device

#### On macOS:
```bash
brew install nvm
nvm install 14
```

#### Alternatively:
Download the Node.js installer directly from the official website

Open [http://localhost:5173](http://localhost:5173) with your browser.

## Assignment description
Please design and implement a geo-location live tracking system.

This product allows users to watch the live geo-location of their beloved pet.

You are required to connect to the SSE (Server-Sent Events) server we supply to accomplish this task.
The SSE server sends "coordinate" events of geo-location messages in the following structure:

```
{
  id: UUID
  type: SYSTEM | MANUAL
  lat: double
  lng: double
}
```


![Image](https://github.com/user-attachments/assets/55aeaa93-80d8-4249-b622-f84b91766fa0)


#### Technical info
- SSE server url: `https://rokak-development-task-backend.onrender.com/connect-sse?key=6YjnvjAkNS`

#### TODO
1. *Draw the pet's track on the map.*
- Draw each point on the map with a circle.
- For the last point, use the pin SVG in the repo.
- Connect each point location you receive to the previous one with a line.
- The line should be drawn in chronological order (the first point is connected by a line to the second point, the second to the third, etc.).

2. *Implement manual report*
   
   Unfortunately, the dog's track does not always show all the locations the dog has traveled to.
   We will add the ability for the user to add locations the dog has traveled to manually.
   - By right-clicking on the map, the user can manually report the location of a dog.
   - The manual report will consist of the location selected on the map by the user.
   - To update the server that there is a new point in the dog's trail, an API request must be sent to the SSE server.
   - Once you have sent a request to the SSE server to manually mark a location, the server will return the location message you marked along with the point ID and the "type" field will be "MANUAL".
   - "MANUAL" points will be drawn on the map as a triangle and "SYSTEM" points will be drawn as a circle.
  
 API Documentation:
 ```
 POST /manual-detection?key=6YjnvjAkNS

body params:
{
  lng: number
  lat: number
}
```

At the end, the app should look like this:

Please note that the design is your choice.

It is recommended that you consider the map's "clarity" as a leading factor in the design.

![Image](https://github.com/user-attachments/assets/d531c6e0-d74a-46a7-bfba-8ebb3527f9cd)


