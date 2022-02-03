import { useRef, useEffect, FC } from "react";
import { Scene, WebGLRenderer, PerspectiveCamera, MeshPhongMaterial, Mesh, DirectionalLight, SphereBufferGeometry, TextureLoader, MeshBasicMaterial, MeshLambertMaterial, RingGeometry, DoubleSide, BoxBufferGeometry, Clock, PointLight, MeshStandardMaterial, Color } from 'three';
import { planetConfigs } from "./config";
import { AxesHelper } from 'three/src/helpers/AxesHelper'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


export const HelloThreeJS: FC = () => {

    const planets: Mesh[] = [];

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const resizeHandleRef = useRef<(renderer: WebGLRenderer, camera: PerspectiveCamera) => void>();


    const loadPlanet = (key: string, scene: Scene) => {
        const planetData = planetConfigs[key];
        const { selfRadius, orbitRadius, img } = planetData;
        const sphere = new SphereBufferGeometry(selfRadius, 60, 60);
        const textureLoader = new TextureLoader();
        const texture = textureLoader.load(planetData.img, (texture) => {
            const material = key === 'Sun' ? new MeshStandardMaterial({
                map: texture
            }) : new MeshLambertMaterial({
                map: texture
            });
            if (key === 'Sun') material.emissive = new Color(0x4C0F07);
            const planet = new Mesh(sphere, material);
            planet.name = key;
            planets.push(planet);
            scene.add(planet);
        });
        const track = new Mesh(
            new RingGeometry(orbitRadius, orbitRadius + 0.05, 60, 1),
            new MeshBasicMaterial({
                side: DoubleSide
            }))
        track.rotation.x = -Math.PI / 2;
        scene.add(track);
    };

    const clock = new Clock();
    const handleRotate = () => {
        const elaspedTime = clock.getElapsedTime();
        planets.forEach((planet) => {
            const name = planet.name;
            const planetData = planetConfigs[name];
            const { rotateSpeed, orbitRadius, revolveSpeed } = planetData;
            const x = orbitRadius * Math.sin(elaspedTime * revolveSpeed * 0.1);
            const z = orbitRadius * Math.cos(elaspedTime * revolveSpeed * 0.1);
            planet.position.set(x, 0, z);
            planet.rotation.y += rotateSpeed;
        })
    }

    const initCamera = () => {
        const camera = new PerspectiveCamera(60, 2, 1, 3000);
        const localPosition = { x: 350, y: 100, z: 10 } //存储初始化位置
        camera.position.set(localPosition.x, localPosition.y, localPosition.z)
        camera.lookAt(0, 0, 0);
        return camera;
    };

    useEffect(() => {
        if (canvasRef.current) {
            // 创建渲染器
            const renderer = new WebGLRenderer({ canvas: canvasRef.current });
            // 创建镜头
            const camera = initCamera();
            // 创建场景
            const scene = new Scene();
            // 加载星球
            Object.keys(planetConfigs).forEach((key) => {
                loadPlanet(key, scene);
            });
            // 创建光源
            const light = new DirectionalLight(0xFFFFFF, 0.5);
            const sunLight = new PointLight(0xFFFFFF, 1)
            light.position.set(0, 10, 0);
            sunLight.position.set(0, 0, 0);
            scene.add(sunLight);
            scene.add(light);
            // 坐标系
            const axis = new AxesHelper(25);
            scene.add(axis);
            // 添加自动旋转渲染动画
            const render = (time: number) => {
                time = time * 0.001;
                handleRotate();
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
                renderer.render(scene, camera);
                window.requestAnimationFrame(render);
            }
            window.requestAnimationFrame(render);
            handleResize(renderer, camera); //默认打开时，即重新触发一次
            resizeHandleRef.current = handleResize;
            const resizeObserver = new ResizeObserver(() => {
                handleResize(renderer, camera);
            });
            resizeObserver.observe(canvasRef.current);
            return () => {
                if (resizeHandleRef && resizeHandleRef.current) {
                    resizeObserver.disconnect();
                }
            };
        }
    }, [canvasRef]);

    const handleResize = (renderer: WebGLRenderer, camera: PerspectiveCamera) => {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    };

    return (
        <canvas width={2400} height={1200} style={{ display: 'block' }} ref={canvasRef}></canvas>
    );
}