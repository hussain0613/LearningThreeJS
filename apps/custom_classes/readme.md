# Two Custom Classes

## `MeshBody extends Body`
### Properties
#### `mesh`
The mesh that is used to represent the body.

### Methods
#### `setMesh(mesh, scene=undefined) -> None`
Sets the mesh property to the given mesh. If scene is given, the mesh is added to the scene.

#### `createMesh(geometry, material, scene=undefined) -> None`
Creates a mesh with the given geometry and material. If scene is given, the mesh is added to the scene. \

#### `update() -> None`
Updates the position and rotation of the mesh to match the position and rotation of the body.

     

## `MyWorld extends World`

### Overridden Methods
#### `step(dt) -> super().step(dt) -> None`
Calls the `step` method of the `parent` class and then calls the `update` methods of all the bodies in the world.

