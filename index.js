function rotateImage(imageId, totalRotations, totalTimeInSeconds) {
    return new Promise((resolve, reject) => {
        const image = document.getElementById(imageId);
        const totalDegrees = 360 * totalRotations; // Total degrees to rotate
        const timePerRotation = totalTimeInSeconds / totalRotations; // Time for each full rotation in seconds

        let startTime = null;

        function rotate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsedTime = (timestamp - startTime) / 1000; // Elapsed time in seconds
            const currentRotation = (elapsedTime / timePerRotation) * 360 % 360; // Current rotation angle

            image.style.transform = `rotate(${currentRotation}deg)`;

            if (elapsedTime < totalTimeInSeconds) {
                requestAnimationFrame(rotate); // Continue rotating until totalTimeInSeconds is reached
            } else {
                // Ensure the image ends up at 0 degrees
                image.style.transform = 'rotate(0deg)';
                resolve(true); // Rotation complete
            }
        }
        requestAnimationFrame(rotate); // Start rotating
    });
}


function rotateImageToAngle(imageId, targetAngle, timeInSeconds) {
    return new Promise((resolve, reject) => {
        const image = document.getElementById(imageId);
        const startAngle = getCurrentRotationAngle(image);
        const startTime = performance.now();
        const endTime = startTime + (timeInSeconds * 1000);

        function updateRotation(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / (timeInSeconds * 1000), 1);
            const currentAngle = startAngle + (targetAngle - startAngle) * progress;

            image.style.transform = `rotate(${currentAngle}deg)`;

            if (progress < 1) {
                requestAnimationFrame(updateRotation);
            } else {
                resolve(true); // Rotation completed successfully
            }
        }

        requestAnimationFrame(updateRotation);
    });
}

function getCurrentRotationAngle(element) {
    const transform = window.getComputedStyle(element).getPropertyValue('transform');
    const matrix = transform.match(/^matrix\((.+)\)$/);
    if (matrix) {
        const values = matrix[1].split(',');
        return Math.round(Math.atan2(parseFloat(values[1]), parseFloat(values[0])) * (180 / Math.PI));
    }
    return 0;
}

function getRandomRotation() {
    return Math.floor(Math.random() * 360);
}

var a = true;
var b = true;
document.getElementById('buttonStart').addEventListener('click', (e) => {
    if (b) {
        b = !b;
        rotateImage('Image-1', 10, 5)
            .then((result) => {
                rotateImage('Image-1', 6, 5).then((result) => {
                    rotateImageToAngle('Image-1', getRandomRotation(), 1)
                        .then((result) => {
                            console.log("Rotation completed successfully:", result);
                            b = result;
                        })
                        .catch((error) => {
                            console.error("Rotation failed:", error);
                        });
                })
            })
            .catch((error) => {
                console.error("Rotation failed:", error);
            });
    }
    if (a) {
        a = !a;
        rotateImage('Image-2', 10, 5)
            .then((result) => {
                rotateImage('Image-2', 6, 5).then((result) => {
                    rotateImageToAngle('Image-2', getRandomRotation(), 1)
                        .then((result) => {
                            console.log("Rotation completed successfully:", result);
                            a = result;
                        })
                        .catch((error) => {
                            console.error("Rotation failed:", error);
                        });
                })
            })
            .catch((error) => {
                console.error("Rotation failed:", error);
            });
    }
})
