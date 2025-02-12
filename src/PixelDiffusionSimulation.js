import * as THREE from 'three';

class PixelDiffusionSimulation {
    constructor(containerId, initialGridSizeX = 150, initialGridSizeY = 150) {
        // Basic simulation parameters
        this.gridSizeX = initialGridSizeX;
        this.gridSizeY = initialGridSizeY;
        this.container = document.getElementById(containerId);
        
        // Simulation state
        this.grid1 = new Float32Array(this.gridSizeX * this.gridSizeY);
        this.grid2 = new Float32Array(this.gridSizeX * this.gridSizeY);
        this.blurredGrid1 = new Float32Array(this.gridSizeX * this.gridSizeY);
        this.blurredGrid2 = new Float32Array(this.gridSizeX * this.gridSizeY);
        
        // Simulation parameters
        this.attraction1 = 0.3;
        this.attraction2 = 0.3;
        this.interaction1Strength = 0.0;
        this.interaction2Strength = 0.0;
        this.sigma = 1.5;
        this.gravity = 0;
        
        // Three.js setup
        this.initThreeJS();
        this.createMesh();
        this.setupControls();
        this.animate();
    }

    initThreeJS() {
        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera setup - using orthographic for 2D viewing
        const aspect = this.container.clientWidth / this.container.clientHeight;
        const frustumSize = 100;
        this.camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            1,
            1000
        );
        this.camera.position.z = 100;

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        // Handle window resizing
        window.addEventListener('resize', () => {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;
            
            this.camera.left = frustumSize * aspect / -2;
            this.camera.right = frustumSize * aspect / 2;
            this.camera.top = frustumSize / 2;
            this.camera.bottom = frustumSize / -2;
            this.camera.updateProjectionMatrix();
            
            this.renderer.setSize(width, height);
        });
    }

    createMesh() {
        // Create data texture for the simulation state
        this.dataTexture = new THREE.DataTexture(
            new Float32Array(this.gridSizeX * this.gridSizeY * 4),
            this.gridSizeX,
            this.gridSizeY,
            THREE.RGBAFormat,
            THREE.FloatType
        );
        this.dataTexture.needsUpdate = true;

        // Create material using custom shader
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: this.dataTexture },
                resolution: { value: new THREE.Vector2(this.gridSizeX, this.gridSizeY) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform vec2 resolution;
                varying vec2 vUv;

                void main() {
                    vec4 texel = texture2D(tDiffuse, vUv);
                    
                    // Red channel for field 2 (red), blue channel for field 1 (blue)
                    float field1 = texel.b;
                    float field2 = texel.r;
                    
                    // Set alpha based on maximum field value
                    float alpha = max(field1, field2);
                    
                    gl_FragColor = vec4(field2, 0.0, field1, alpha);
                }
            `
        });

        // Create plane geometry for rendering
        const geometry = new THREE.PlaneGeometry(100, 100);
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.mesh);
    }

    updateDataTexture() {
        // Update texture data from simulation state
        const data = this.dataTexture.image.data;
        for (let i = 0; i < this.grid1.length; i++) {
            const i4 = i * 4;
            data[i4] = this.blurredGrid2[i];     // Red channel - Field 2
            data[i4 + 1] = 0;                     // Green channel - unused
            data[i4 + 2] = this.blurredGrid1[i];  // Blue channel - Field 1
            data[i4 + 3] = Math.max(this.blurredGrid1[i], this.blurredGrid2[i]); // Alpha
        }
        this.dataTexture.needsUpdate = true;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }

    // Placeholder for future GPU-accelerated methods
    applyGaussianBlur() {
        // TODO: Implement using compute shader
        console.log("GPU Gaussian blur not yet implemented");
    }

    rollDice() {
        // TODO: Implement using compute shader
        console.log("GPU random number generation not yet implemented");
    }

    discretize() {
        // TODO: Implement using compute shader
        console.log("GPU discretization not yet implemented");
    }

    setupControls() {
        // TODO: Implement UI controls
        console.log("Controls not yet implemented");
    }
}

export default PixelDiffusionSimulation;