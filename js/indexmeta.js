function main() {
    const canvas = document.getElementById("renderCanvas");

    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
    const engine = new BABYLON.Engine(canvas, true);


    function createScene() {
        const scene = new BABYLON.Scene(engine);

        let Cube = null;

        
        BABYLON.SceneLoader.ImportMeshAsync("", "./scene/", "sado5.glb", scene).then((result) => {
            result.meshes.forEach((mesh) => {
                console.log("Loaded mesh name:", mesh.name);
            });
            
            Cube = result.meshes.find(mesh => mesh.name === "Cube.132");
            if (!Cube) {
                console.error("Cube mesh not found in the loaded scene.");
            }

            for (let i = 1; i <= 6; i++) {
                const meshName = `coli.00${i}`;
                const mesh = result.meshes.find(mesh => mesh.name === meshName);
                if (mesh) {
                    mesh.checkCollisions = true;
                }
            }
        });

        
        scene.gravity = new BABYLON.Vector3(0, -0.9, 0);

        const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(3, 2, 0), scene);

        
        camera.inputs.addMouseWheel();
        camera.attachControl(canvas, true);
    
        camera.setTarget(BABYLON.Vector3.Zero());

        
        scene.collisionsEnabled = true;

        
        camera.checkCollisions = true;

        
        camera.ellipsoid = new BABYLON.Vector3(1,1,0.7);

        camera.applyGravity = true;

        camera.speed = 1.5;
        BABYLON.Engine.CollisionsEpsilon = 0.0001;
        camera.inertia = 0.8;

        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);





        
        let isJumping = false;
        let jumpSpeed = 0.3;  
        let jumpHeight = 2.1;   
        //let initialYPosition = camera.position.y;  


        
        const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        
        const jumpButton = BABYLON.GUI.Button.CreateSimpleButton("jumpButton", "Jump");
        jumpButton.width = "150px";
        jumpButton.height = "40px";
        jumpButton.color = "white";
        jumpButton.background = "green";

        
        jumpButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        jumpButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        jumpButton.left = "-20px"; 
        jumpButton.top = "-20px"; 

        
        let jumpVelocity = 0; 

        jumpButton.onPointerUpObservable.add(() => {
            console.log("Jump button pressed");
            if (!isJumping) {
                isJumping = true;
                jumpVelocity = jumpSpeed; 
            }
        });

        
        scene.registerBeforeRender(() => {
            
            if (isJumping) {
                camera.position.y += jumpVelocity; 
                jumpVelocity -= 0.03; 
        
                
                if (camera.position.y <= jumpHeight) {
                    isJumping = false;
                    jumpVelocity = 0; 
                }
            }

            
            if (camera.position.y < 1) {
                camera.position.y = 1; 
                isJumping = false; 
                jumpVelocity = 0; 
            }


            
            const forward = camera.getFrontPosition(1).subtract(camera.position).normalize();
            const right = BABYLON.Vector3.Cross(forward, camera.upVector).normalize();

            
            const moveVector = forward.scale(-joystickDelta.y).add(right.scale(-joystickDelta.x));
            camera.cameraDirection.x += moveVector.x * camera.speed * engine.getDeltaTime() / 1000;
            camera.cameraDirection.z += moveVector.z * camera.speed * engine.getDeltaTime() / 1000;

            
            if (isJumping) {
                camera.position.addInPlace(moveVector.scale(camera.speed * engine.getDeltaTime() / 1000));
            }
        });



        /*scene.registerBeforeRender(() => {
            
            let moveDirection = new BABYLON.Vector3.Zero();
            if (joystick.forward) {
                moveDirection.z += 1; 
            }
            if (joystick.backward) {
                moveDirection.z -= 1; 
            }
            if (joystick.left) {
                moveDirection.x -= 1; 
            }
            if (joystick.right) {
                moveDirection.x += 1; 
            }
            
            
            moveDirection.normalize();
        
            
        
            
            if (joystick.jump && isGrounded() && !isJumping) {
                isJumping = true;
                velocityY = jumpSpeed; 
            }
        
            
            if (isJumping) {
                velocityY += gravity * scene.getEngine().getDeltaTime() / 1000;  // 重力の影響を受ける
        
                
                playerMesh.position.addInPlace(moveDirection.scale(scene.getEngine().getDeltaTime()));
                playerMesh.position.y += velocityY * scene.getEngine().getDeltaTime();
        
                
                if (playerMesh.position.y <= groundLevel) {
                    playerMesh.position.y = groundLevel;
                    isJumping = false;
                }
            }
        });*/


        
        advancedTexture.addControl(jumpButton);



        
        /*
        function jump() {
            if (!isJumping) {
                isJumping = true;

                let targetY = camera.position.y + jumpHeight;

                
                const jumpInterval = setInterval(() => {
                    if (camera.position.y >= targetY) {
                        clearInterval(jumpInterval);
                        
                        isJumping = false;
                    } else {
                        camera.position.y += jumpSpeed;  
                    }
                }, 16);  
            }
        }*/

        
        /*const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        const jumpButton = new BABYLON.GUI.Button.CreateSimpleButton("jumpButton", "Jump");
        jumpButton.width = "150px";
        jumpButton.height = "60px";
        jumpButton.color = "white";
        jumpButton.background = "green";
        jumpButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        jumpButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        jumpButton.top = "-50px";  
        jumpButton.left = "-20px";  
        advancedTexture.addControl(jumpButton);

        
        jumpButton.onPointerDownObservable.add(function () {
            jump();
        });*/



        const pointerToKey = new Map();

        
        let joystickContainer = document.createElement("div");
        joystickContainer.style.position = "absolute";
        joystickContainer.style.left = "100px";
        joystickContainer.style.bottom = "100px";
        joystickContainer.style.width = "100px";
        joystickContainer.style.height = "100px";
        joystickContainer.style.backgroundColor = "rgba(200, 200, 200, 0.5)";
        joystickContainer.style.borderRadius = "50%";
        document.body.appendChild(joystickContainer);

        let joystickPuck = document.createElement("div");
        joystickPuck.style.position = "absolute";
        joystickPuck.style.left = "40px";
        joystickPuck.style.top = "40px";
        joystickPuck.style.width = "20px";
        joystickPuck.style.height = "20px";
        joystickPuck.style.backgroundColor = "gray";
        joystickPuck.style.borderRadius = "50%";
        joystickContainer.appendChild(joystickPuck);

        let isDraggingJoystick = false;
        let initialTouchPoint = { x: 0, y: 0 };
        let joystickDelta = { x: 0, y: 0 };

        
        joystickContainer.addEventListener("pointerdown", (event) => {
            isDraggingJoystick = true;
            initialTouchPoint = { x: event.clientX, y: event.clientY };
            event.preventDefault(); 
        });
        

        
        joystickContainer.addEventListener("touchmove", (event) => {
            if (isDraggingJoystick) {
                const touch = event.touches[0]; 
                let deltaX = touch.clientX - initialTouchPoint.x;
                let deltaY = touch.clientY - initialTouchPoint.y;
                let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                let maxDistance = 50;

                
                if (distance > maxDistance) {
                    let angle = Math.atan2(deltaY, deltaX);
                    deltaX = Math.cos(angle) * maxDistance;
                    deltaY = Math.sin(angle) * maxDistance;
                }

                joystickPuck.style.left = `${50 + deltaX}px`;
                joystickPuck.style.top = `${50 + deltaY}px`;

                joystickDelta.x = deltaX / maxDistance;
                joystickDelta.y = deltaY / maxDistance;

                event.preventDefault(); 
            }
        });

        joystickContainer.addEventListener("touchend", () => {
            isDraggingJoystick = false;
            joystickPuck.style.left = "50px";
            joystickPuck.style.top = "50px";
            joystickDelta = { x: 0, y: 0 };
        });

        

        
        joystickContainer.addEventListener("pointermove", (event) => {
            if (isDraggingJoystick) {
                let deltaX = event.clientX - initialTouchPoint.x;
                let deltaY = event.clientY - initialTouchPoint.y;
                let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                let maxDistance = 50;  

                
                /*if (distance > maxDistance) {
                    let angle = Math.atan2(deltaY, deltaX);
                    deltaX = Math.cos(angle) * maxDistance;
                    deltaY = Math.sin(angle) * maxDistance;
                }*/

                
                let angle = Math.atan2(deltaY, deltaX);
                if (distance > maxDistance) {
                    deltaX = Math.cos(angle) * maxDistance;
                    deltaY = Math.sin(angle) * maxDistance;
                }

                
                joystickPuck.style.left = `${50 + deltaX}px`;
                joystickPuck.style.top = `${50 + deltaY}px`;

                
                joystickDelta.x = deltaX / maxDistance;
                joystickDelta.y = deltaY / maxDistance;

                
                updateMovementDirection(joystickDelta);
            }
        });


        /*joystickContainer.addEventListener("pointermove", (event) => {
            if (isDraggingJoystick) {
                let deltaX = event.clientX - initialTouchPoint.x;
                let deltaY = event.clientY - initialTouchPoint.y;
                let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                let maxDistance = 50;  

                if (distance > maxDistance) {
                    let angle = Math.atan2(deltaY, deltaX);
                    deltaX = Math.cos(angle) * maxDistance;
                    deltaY = Math.sin(angle) * maxDistance;
                }

                joystickPuck.style.left = `${50 + deltaX}px`;
                joystickPuck.style.top = `${50 + deltaY}px`;

                joystickDelta.x = deltaX / maxDistance;
                joystickDelta.y = deltaY / maxDistance;
            }
        });*/

        joystickContainer.addEventListener("pointerup", () => {
            isDraggingJoystick = false;
            joystickPuck.style.left = "50px";
            joystickPuck.style.top = "50px";
            joystickDelta = { x: 0, y: 0 };
        });

        
        let isRotatingCamera = false;
        let previousPointerPosition = { x: 0, y: 0 };

        canvas.addEventListener("pointerdown", (event) => {
            if (event.clientX > canvas.width / 2) {  
                isRotatingCamera = true;
                previousPointerPosition = { x: event.clientX, y: event.clientY };
            }
        });

        canvas.addEventListener("pointermove", (event) => {
            if (isRotatingCamera) {
                let deltaX = event.clientX - previousPointerPosition.x;
                let deltaY = event.clientY - previousPointerPosition.y;

                camera.rotation.y += deltaX * 0.002;
                camera.rotation.x += deltaY * 0.002;

                previousPointerPosition = { x: event.clientX, y: event.clientY };
            }
        });

        canvas.addEventListener("pointerup", () => {
            isRotatingCamera = false;
            console.log("pointer up");
        });

        
        scene.registerBeforeRender(() => {
            
            const forward = camera.getFrontPosition(1).subtract(camera.position).normalize();
            const right = BABYLON.Vector3.Cross(forward, camera.upVector).normalize();

            
            const moveVector = forward.scale(-joystickDelta.y).add(right.scale(-joystickDelta.x));

            camera.cameraDirection.x += moveVector.x * camera.speed * engine.getDeltaTime() / 1000;
            camera.cameraDirection.z += moveVector.z * camera.speed * engine.getDeltaTime() / 1000;
            
        });


        
        const stopJoystick = () => {
            if (isDraggingJoystick) {
                isDraggingJoystick = false;
                joystickPuck.style.left = "50px";
                joystickPuck.style.top = "50px";
                joystickDelta = { x: 0, y: 0 };
                console.log("Pointer up - Joystick stop");
            }
        };

        //document.addEventListener("pointerup", stopJoystick);
        //window.addEventListener("pointerup", stopJoystick);  

        
        //document.addEventListener("touchend", stopJoystick);
        //window.addEventListener("touchend", stopJoystick);

        joystickContainer.addEventListener("touchend", stopJoystick);

        // Debugging logs
        document.addEventListener("pointerup", (e) => console.log("Pointer up - Document", e));
        //window.addEventListener("pointerup", (e) => console.log("Pointer up - Window", e));
        document.addEventListener("touchend", (e) => console.log("Touch end - Document", e));
        //window.addEventListener("touchend", (e) => console.log("Touch end - Window", e));

        
        joystickContainer.addEventListener("pointerup", (e) => {
            console.log("Pointer up - Joystick area", e);
        });



        return scene;
    }

    const scene = createScene();

    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener("resize", () => { engine.resize(); });
}

window.addEventListener('DOMContentLoaded', main);
