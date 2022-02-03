import { useRef, useEffect, FC, useCallback } from "react";
import { WebGLRenderer, PerspectiveCamera, MeshPhongMaterial, Mesh, DirectionalLight, BoxBufferGeometry, Line, Points } from 'three';
import * as Three from 'three';
import myBox from "./Box";
import myCircle from "./Circle";

const meshArr: (Three.Mesh | Three.LineSegments)[] = [];

export const HelloPrimitives: FC = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const resizeHandleRef = useRef<(renderer: WebGLRenderer, camera: PerspectiveCamera) => void>();
    const rendererRef = useRef<Three.WebGLRenderer>();
    const cameraRef = useRef<Three.PerspectiveCamera>();

    const createMaterial = () => {
        const material = new MeshPhongMaterial({ side: Three.DoubleSide })
        const hue = Math.floor(Math.random() * 100) / 100; //随机获得一个色相
        console.log('%c [ hue ]-13', 'font-size:13px; background:pink; color:#bf2c9f;', hue)
        const saturation = 1;
        const luminance = 0.5;
        material.color.setHSL(hue, saturation, luminance);
        return material
    };

    const createInit = useCallback(
        () => {

            if (canvasRef.current === null) {
                return;
            }
            meshArr.length = 0; //以防万一，先清空原有数组



            //初始化场景

            // Create Scene
            const scene = new Three.Scene();
            // Point
            const point = new Points();
            scene.add(point);
            // Line
            const line = new Line();
            scene.add(line);
            // Mesh
            const geometry = new BoxBufferGeometry(1, 1, 1);
            const material = new MeshPhongMaterial();
            scene.add(new Mesh(geometry, material));
            // Light
            const light = new DirectionalLight();
            scene.add(light);
            // Scene
            const scene2 = new Three.Scene();
            scene.add(scene2);


            console.log(scene.toJSON())

            //初始化镜头
            const camera = new PerspectiveCamera(40, 2, 0.1, 1000);
            camera.position.z = 120
            cameraRef.current = camera;

            //初始化渲染器
            const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current as HTMLCanvasElement });
            rendererRef.current = renderer;

            //添加 2 盏灯光
            const light0 = new Three.DirectionalLight(0xFFFFFF, 1);
            light0.position.set(-1, 2, 4);
            scene.add(light0);

            const light1 = new Three.DirectionalLight(0xFFFFFF, 1);
            light0.position.set(1, -2, -4);
            scene.add(light1);

            //获得各个 solid 类型的图元实例，并添加到 solidPrimitivesArr 中
            const solidPrimitivesArr: Three.BufferGeometry[] = []
            solidPrimitivesArr.push(myBox, myCircle);
            // solidPrimitivesArr.push(myExtrude, myIcosahedron, myLathe, myOctahedron, myParametric)
            // solidPrimitivesArr.push(myPlane, myPolyhedron, myRing, myShape, mySphere)
            // solidPrimitivesArr.push(myTetrahedron, myTorus, myTorusKnot, myTube)

            //将各个 solid 类型的图元实例转化为网格，并添加到 primitivesArr 中
            solidPrimitivesArr.forEach((item) => {
                const material = createMaterial(); //随机获得一种颜色材质
                const mesh = new Three.Mesh(item, material);
                meshArr.push(mesh); //将网格添加到网格数组中
            })

            //获得各个 line 类型的图元实例，并添加到 meshArr 中
            const linePrimitivesArr: Three.BufferGeometry[] = [];
            // linePrimitivesArr.push(myEdges, myWireframe);

            //将各个 line 类型的图元实例转化为网格，并添加到 meshArr 中
            linePrimitivesArr.forEach((item) => {
                const material = new Three.LineBasicMaterial({ color: 0x000000 });
                const mesh = new Three.LineSegments(item, material);
                meshArr.push(mesh);
            })

            //定义物体在画面中显示的网格布局
            const eachRow = 5 //每一行显示 5 个
            const spread = 15 //行高 和 列宽

            //配置每一个图元实例，转化为网格，并位置和材质后，将其添加到场景中
            meshArr.forEach((mesh, index) => {
                //我们设定的排列是每行显示 eachRow，即 5 个物体、行高 和 列宽 均为 spread 即 15
                //因此每个物体根据顺序，计算出自己所在的位置
                const row = Math.floor(index / eachRow) //计算出所在行
                const column = index % eachRow //计算出所在列

                mesh.position.x = (column - 2) * spread //为什么要 -2 ？
                //因为我们希望将每一行物体摆放的单元格，依次是：-2、-1、0、1、2，这样可以使每一整行物体处于居中显示
                mesh.position.y = (2 - row) * spread

                scene.add(mesh) //将网格添加到场景中
            })

            //添加自动旋转渲染动画
            const render = (time: number) => {
                time = time * 0.001
                meshArr.forEach(item => {
                    item.rotation.x = time
                    item.rotation.y = time
                })

                renderer.render(scene, camera)
                window.requestAnimationFrame(render)
            }
            window.requestAnimationFrame(render)
        },
        [canvasRef],
    )

    useEffect(() => {
        createInit();

        handleResize(); //默认打开时，即重新触发一次
        resizeHandleRef.current = handleResize;
        const resizeObserver = new ResizeObserver(() => {
            handleResize();
        });
        resizeObserver.observe(canvasRef.current as HTMLCanvasElement);

        return () => {
            if (resizeHandleRef && resizeHandleRef.current) {
                resizeObserver.disconnect();
            }
        }
    }, [canvasRef]);

    const handleResize = () => {
        const canvas = canvasRef.current as HTMLCanvasElement;
        if (cameraRef.current) {
            cameraRef.current.aspect = canvas.clientWidth / canvas.clientHeight;
            cameraRef.current.updateProjectionMatrix();
        }
        if (rendererRef.current) {
            rendererRef.current.setSize(canvas.clientWidth, canvas.clientHeight, false);
        }
    };

    return (
        <canvas width={1200} height={1200} style={{ display: 'block' }} ref={canvasRef}></canvas>
    );
}