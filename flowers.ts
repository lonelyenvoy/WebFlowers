/**
 * flowers.ts
 * Controls the behavior of flowers.html
 * @author lonelyenvoy <lonelyenvoy@gmail.com>
 */

/**
 * App related constants
 */
namespace constants {
    export const minLeaves = 1
    export const maxLeaves = 4
    export const minStamens = 25
    export const maxStamens = 30
}

/**
 * Dom related operations
 */
namespace dom {
    /**
     * Get canvas div
     * @returns canvas
     */
    export function canvas(): HTMLElement {
        return <HTMLElement>document.getElementById('canvas-frame')
    }
}

/**
 * Errors
 */
namespace error {
    /**
     * Indicates one or many arguments are illegal
     */
    export class IllegalArgumentError extends Error {}
}

/**
 * General utils
 */
namespace util {
    /**
     * Generate python-like range
     * @param {number} bound - upper bound of the range
     * @returns {number[]} result, for example [0, 1, 2, 3, 4]
     */
    export function range(bound: number): number[] {
        if (bound < 0) throw new error.IllegalArgumentError('Invalid range bound')
        return Array.from(Array(bound).keys())
    }

    /**
     * Get random double value in [a, b), or [0, a) if b is not given
     * @param {number} a - low bound
     * @param {number} b - high bound
     * @returns {number} random value
     */
    export function random(a: number, b?: number): number {
        if (b === undefined) return Math.random() * a
        else return Math.random() * Math.abs(b - a) + Math.min(a, b)
    }

    /**
     * Get random item from an array
     * @param items - items array
     * @returns a random item
     */
    export function randomlyPick(items: any[]): any {
        return items[Math.floor(random(items.length))]
    }

    /**
     * Generate random boolean array
     * @param {number} length - the length of the array
     * @returns {boolean[]} result, for example [true, true, false]
     */
    export function randomBooleanArray(length: number): boolean[] {
        if (length < 0) throw new error.IllegalArgumentError('Invalid array length')
        const array = []
        for (const _ of range(length)) {
            array.push(Math.round(Math.random()) === 1)
        }
        return array
    }

    /**
     * Generate random boolean array with lower and upper bounds on the number of trues in array
     * @param {number} length - the length of the array
     * @param {number} lowerBound - the lower bound of the number of trues in array
     * @param {number} upperBound - the upper bound of the number of trues in array
     * @returns {boolean[]} result, for example [true, true, false]
     */
    export function boundedRandomBooleanArray(length: number, lowerBound: number, upperBound: number): boolean[] {
        // ensure bounds validity
        if (lowerBound > upperBound) {
            const tmp = lowerBound
            lowerBound = upperBound
            upperBound = tmp
        }
        if (length < 0) throw new error.IllegalArgumentError('Invalid array length')
        if (lowerBound > length || upperBound < 0) throw new error.IllegalArgumentError('Invalid bounds')
        // generate random array
        const array: boolean[] = randomBooleanArray(length)
        // limit number of trues
        let trues: number
        while (
            (trues = array.filter(x => x === true).length) < lowerBound || trues > upperBound) {
            const toBe: boolean = trues < lowerBound
            const indexes: number[] =
                array
                    .map((item, index) => item !== toBe ? index : -1)
                    .filter(x => x !== -1)

            array[indexes[Math.floor(random(0, indexes.length))]] = toBe
        }
        return array
    }

    /**
     * Do AND-operation on arrays
     * @param {boolean[]} arrays - candidate arrays
     * @returns {boolean[]}
     * @example
     * > andBooleanArrays([true, false, true], [false, true, false])
     * > [false, false, true]
     */
    export function andBooleanArrays(...arrays: boolean[][]): boolean[] {
        if (arrays.length === 0) return []
        const result: boolean[] = fillArray(Array(arrays[0].length), true)
        arrays.map((array) => {
            array.map((item, index) => {
                if (!item) result[index] = false
            })
        })
        return result
    }

    /**
     * Fill an array with all the same thing
     * @param {T[]} array - the array to be filled
     * @param {T} item - the item to be filled in
     * @returns {T[]} result, for example [1, 1, 1, 1]
     */
    export function fillArray<T>(array: T[], item: T): T[] {
        for (let i = 0; i < array.length; i++) {
            array[i] = item
        }
        return array
    }

    /**
     * Retrieve the first item subject to a predicate in an array
     * @param {T[]} array - the array being tested
     * @param {(item: T) => boolean} predicate - the predicate to filter array
     * @returns {T | null} the expected item in the array, or null if none is found
     */
    export function first<T>(array: T[], predicate: (item: T, index: number) => boolean): T | null {
        const index: number | null = firstIndex(array, predicate)
        if (index === null) return null
        return array[index]
    }

    /**
     * Retrieve the index of the first item subject to a predicate in an array
     * @param {T[]} array - the array being tested
     * @param {(item: T) => boolean} predicate - the predicate to filter array
     * @returns {number | null} the index of the expected item in the array, or null if none is found
     */
    export function firstIndex<T>(array: T[], predicate: (item: T, index: number) => boolean): number | null {
        for (const i of range(array.length)) {
            if (predicate(array[i], i)) {
                return i
            }
        }
        return null
    }
}

/**
 * Functional Extensions for THREE.js
 */
namespace threeEx {
    /**
     * THREE.Group helper
     */
    export class GroupHelper {
        private constructor(private group: THREE.Group) {}
        static of(group: THREE.Group): GroupHelper {
            return new GroupHelper(group)
        }

        scale(x = 1, y = 1, z = 1): this {
            this.group.scale.set(x, y, z)
            return this
        }

        positioning(x = 0, y = 0, z = 0): this {
            this.group.position.set(x, y, z)
            return this
        }

        rotate(x: number, y: number, z: number): this {
            this.group.rotation.set(x, y, z)
            return this
        }

        rotateX(x: number): this {
            this.group.rotation.x = x
            return this
        }

        rotateY(y: number): this {
            this.group.rotation.y = y
            return this
        }

        rotateZ(z: number): this {
            this.group.rotation.z = z
            return this
        }

        show(): this {
            this.group.visible = true
            return this
        }

        hide(): this {
            this.group.visible = false
            return this
        }

        clone(): GroupHelper {
            return GroupHelper.of(this.group.clone())
        }

        collect(): THREE.Group {
            return this.group
        }
    }
}

namespace polyfills {
    /**
     * Polyfill for Date.now
     * @impure
     */
    function dateNow() {
        if (!Date.now)
            Date.now = function() { return new Date().getTime() };
    }

    /**
     * Polyfill for window.requestAnimationFrame
     * @requires dateNow()
     * @impure
     */
    function requestAnimationFrame() {
        const vendors = ['webkit', 'moz']
        for (let i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
            const vp = vendors[i]
            window.requestAnimationFrame = (window as any)[vp+'RequestAnimationFrame']
            window.cancelAnimationFrame = ((window as any)[vp+'CancelAnimationFrame']
                || (window as any)[vp+'CancelRequestAnimationFrame'])
        }
        if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
            || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
            let lastTime = 0
            window.requestAnimationFrame = function(callback) {
                const now = Date.now()
                const nextTime = Math.max(lastTime + 16, now)
                return setTimeout(function() { callback(lastTime = nextTime); },
                    nextTime - now)
            }
            window.cancelAnimationFrame = clearTimeout
        }
    }

    /**
     * Install all polyfills
     * @impure
     */
    export function install() {
        dateNow()
        requestAnimationFrame()
    }
}

/**
 * Main Control flow
 */
namespace control {

    function Renderer(): THREE.WebGLRenderer {
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        })
        renderer.setSize(dom.canvas().clientWidth, dom.canvas().clientHeight)
        renderer.setClearColor(0xcce0ff, 1.0)
        return renderer
    }

    function Camera(): THREE.PerspectiveCamera {
        const camera = new THREE.PerspectiveCamera(
            60,
            dom.canvas().clientWidth / dom.canvas().clientHeight,
            1,
            3000
        )
        camera.position.set(-80, 60, 80)
        camera.up.set(0, 1, 0)
        return camera
    }

    function Scene(): THREE.Scene {
        return new THREE.Scene()
    }

    function Light(): THREE.Light {
        const light = new THREE.DirectionalLight(0xdfebff)
        light.position.set(0, 100, 100)
        light.castShadow = true
        return light
    }

    function OrbitControls(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer)
        : THREE.OrbitControls {
        const orbitControls = new THREE.OrbitControls(camera, renderer.domElement)
        orbitControls.enableDamping = true
        orbitControls.dampingFactor = 0.20
        orbitControls.enableZoom = true
        orbitControls.autoRotate = false
        orbitControls.minDistance  = 20
        orbitControls.maxDistance  = 600
        orbitControls.enablePan = true
        orbitControls.target = new THREE.Vector3(0, 15, 0)
        return orbitControls
    }

    function GridHelper(): THREE.GridHelper {
        return new THREE.GridHelper(
            1000,
            100,
            0xF0F0FF,
            0xF0F8FF
        )
    }

    function AxesHelper(): THREE.AxesHelper {
        return new THREE.AxesHelper(50)
    }

    /**
     * THREE.js object loading utils
     */
    namespace objectLoading {

        /**
         * General object loading function
         * @param {string} modelUrl - Url of the model to be load
         * @param {string} modelTextureUrl - Url of the texture to be load
         * @param {(event: ProgressEvent) => void} onProgress - progress reporting callback
         */
        function loadObject(
            modelUrl: string,
            modelTextureUrl: string,
            onProgress = (event: ProgressEvent): void => {
                if (event.lengthComputable) {
                    console.log(Math.round(event.loaded / event.total * 100) + '% downloaded')
                }
            }
        ): Promise<THREE.Group> {
            return new Promise<THREE.Group>((resolve, reject) => {
                // load texture
                const textureLoader = new THREE.TextureLoader()
                const map = textureLoader.load(modelTextureUrl)
                // load obj
                const objLoader = new THREE.OBJLoader()
                objLoader.load(modelUrl, (object) => {
                    const group = new THREE.Group()
                    object.traverse((child) => {
                        if (child instanceof THREE.Mesh){
                            child.material = new THREE.MeshLambertMaterial({map: map})
                            child.material.side = THREE.DoubleSide
                            group.add(child.clone())
                        }
                    })
                    resolve(group)
                }, onProgress, (event: ErrorEvent) => reject(event))
            })
        }

        /**
         * Load land object
         * @returns {Promise<Group>} land object in Promise
         */
        export async function loadLand(): Promise<THREE.Group> {
            const land: THREE.Group = await loadObject('models/land.obj', 'models/land.jpg')
            return threeEx.GroupHelper.of(land)
                .scale(30, 30, 30)
                .rotateY(-(Math.PI / 8 + Math.PI / 2))
                .positioning(0, 10, 0)
                .show()
                .collect()
        }

        /**
         * Load stem object
         * @returns {Promise<Group>} stem object in Promise
         */
        export async function loadStem(): Promise<THREE.Group> {
            const stem: THREE.Group = await loadObject('models/stem.obj', 'models/stem.jpg')
            return threeEx.GroupHelper.of(stem).scale(1, 0.1, 0.1).show().collect()
        }

        /**
         * Load torus object
         * @returns {Promise<Group>} torus object in Promise
         */
        export async function loadTorus(): Promise<THREE.Group> {
            const torus: THREE.Group = await loadObject(
                'models/torus.obj',
                util.randomlyPick(util.range(5).map(x => 'models/torus' + x + '.jpg'))
            )
            return threeEx.GroupHelper.of(torus)
                .scale(0.01, 0.01, 0.01)
                .positioning(0.5, 29.5, 0.125)
                .rotateX(Math.PI * 0.2778)
                .hide()
                .collect()
        }

        /**
         * Load stamens object
         * @returns {Promise<Group[]>} stamens object in Promise
         */
        export async function loadStamens(): Promise<THREE.Group[]> {
            const stamen: THREE.Group = await loadObject('models/stamen.obj', 'models/stamen.png')
            const basicGroupHelper =
                threeEx.GroupHelper.of(stamen)
                    .scale(0.02, 0.02, 0.02)
                    .positioning(0, 29.5, 0)
                    .rotateX(0.9)
                    .hide()
            const positions = [
                [-0.5, 29.5, 0],
                [-0.25, 29.75, -0.25],
                [-0.25, 29.5, 0],
                [-0.25, 29.25, 0.25],
                [0, 30, -0.5],
                [0, 29.75, -0.25],
                [0, 29.5, 0],
                [0, 29.25, 0.25],
                [0, 29, 0.5],
                [0.25, 30, -0.5],
                [0.25, 29.75, -0.25],
                [0.25, 29.5, 0],
                [0.25, 29.25, 0.25],
                [0.25, 29, 0.5],
                [0.5, 30, -0.5],
                [0.5, 29.75, -0.25],
                [0.5, 29.5, 0],
                [0.5, 29.25, 0.25],
                [0.5, 29, 0.5],
                [0.75, 30, -0.5],
                [0.75, 29.75, -0.25],
                [0.75, 29.5, 0],
                [0.75, 29.25, 0.25],
                [0.75, 29, 0.5],
                [1, 30, -0.5],
                [1, 29.75, -0.25],
                [1, 29.5, 0],
                [1, 29.25, 0.25],
                [1, 29, 0.5],
                [1.25, 29.75, -0.25],
                [1.25, 29.5, 0],
                [1.25, 29.25, 0.25],
                [1.5, 29.5, 0]
            ]
            const stamens: THREE.Group[] = []
            for (const position of positions) {
                stamens.push(
                    basicGroupHelper
                        .clone()
                        .positioning(position[0], position[1], position[2])
                        .collect()
                )
            }
            return stamens
        }

        /**
         * Load petals objects
         * @returns {Promise<Group[]>} petals objects in Promise
         */
        export async function loadPetals(): Promise<THREE.Group[]> {
            const petal: THREE.Group = await loadObject(
                util.randomlyPick(['petal0.obj', 'petal1.obj', 'petal2.obj'].map(x => 'models/' + x)),
                util.randomlyPick(['petal0.jpg', 'petal1.jpg', 'petal2.jpg', 'petal3.png'].map(x => 'models/' + x))
            )
            const basicGroupHelper =
                threeEx.GroupHelper.of(petal)
                    .scale(0.1, 0.1, 0.1)
                    .positioning(1, 25, -1)
                    .hide()
            // randomly generate 4/5/6/7 petals
            const rotations = util.randomlyPick([[
                [1.5, 0, 0],
                [1.7, Math.PI / 2, -0.6],
                [-0.1, Math.PI, 0.6],
                [-0.1, (Math.PI / 2) * 3, 0],
            ], [
                [1.5, 0, 0],
                [1.7, (Math.PI / 5) * 2, -0.6],
                [-0.1, (Math.PI / 5) * 4, 0.6],
                [-0.1, (Math.PI / 5) * 6, 0],
                [-0.9, (Math.PI / 5) * 8, -2],
            ], [
                [1.5, 0, 0],
                [1.7, (Math.PI / 3), -0.6],
                [-0.7, (Math.PI / 3) * 2, 0.6],
                [-0.1, (Math.PI / 3) * 3, 0],
                [-0.9, (Math.PI / 3) * 4, -2],
                [1.7, (Math.PI / 3) * 5, 1.5],
            ],[
                [1.5, 0, 0],
                [1.7, (Math.PI / 7) * 2, -0.6],
                [-0.7, (Math.PI / 7) * 4, 0.6],
                [-0.1, (Math.PI / 7) * 6, 0],
                [-0.1, (Math.PI / 7) * 8, 0],
                [1.7, (Math.PI / 7) * 10, 1.5],
                [1.7, (Math.PI / 7) * 12, 0],
            ]])
            const petals: THREE.Group[] = []
            for (const rotation of rotations) {
                petals.push(
                    basicGroupHelper
                        .clone()
                        .rotate(rotation[0], rotation[1], rotation[2])
                        .collect()
                )
            }
            return petals
        }

        /**
         * Load leaves objects
         * @returns {Promise<Group[]>} leaves objects in Promise
         */
        export async function loadLeaves(): Promise<THREE.Group[]> {
            const leaf: THREE.Group = await loadObject('models/leaf.obj', 'models/stem.jpg')
            const basicGroupHelper =
                threeEx.GroupHelper.of(leaf)
                    .scale(0.1, 0.1, 0.1)
                    .hide()
            const getXRandomRotation = () => Math.PI * util.random(-0.5, 0.5)
            const getYRandomRotation = () => Math.PI * util.random(-1, 1)
            return [
                basicGroupHelper
                    .clone()
                    .positioning(0.5, 5, 0.5)
                    .rotateX(getXRandomRotation())
                    .rotateY(getYRandomRotation())
                    .collect(),
                basicGroupHelper
                    .clone()
                    .positioning(0.5, 7, -0.25)
                    .rotateX(getXRandomRotation())
                    .rotateY(getYRandomRotation())
                    .collect(),
                basicGroupHelper
                    .clone()
                    .positioning(0.5, 10, -0.5)
                    .rotateX(getXRandomRotation())
                    .rotateY(getYRandomRotation())
                    .collect(),
                basicGroupHelper
                    .clone()
                    .positioning(0.5, 15, -1.75)
                    .rotateX(getXRandomRotation())
                    .rotateY(getYRandomRotation())
                    .collect(),
                basicGroupHelper
                    .clone()
                    .positioning(0.75, 19, -2.75)
                    .rotateX(getXRandomRotation())
                    .rotateY(getYRandomRotation())
                    .collect(),
                basicGroupHelper
                    .clone()
                    .positioning(0.5, 23, -3.5)
                    .rotateX(getXRandomRotation())
                    .rotateY(getYRandomRotation())
                    .collect(),
            ]
        }

    }

    /**
     * Rendering utils
     */
    namespace rendering {

        /**
         * Used to check whether it's necessary to repaint the objects in scene
         */
        class ValidityChecker {
            private constructor(private stem: THREE.Group,
                                private torus: THREE.Group,
                                private stamens: THREE.Group[],
                                private petals: THREE.Group[],
                                private leaves: THREE.Group[]) {
                this.stamensLottery = util.boundedRandomBooleanArray(this.stamens.length, constants.minStamens, constants.maxStamens)
                this.leavesLottery = util.boundedRandomBooleanArray(this.leaves.length, constants.minLeaves, constants.maxLeaves)
            }
            static of(stem: THREE.Group,
                      torus: THREE.Group,
                      stamens: THREE.Group[],
                      petals: THREE.Group[],
                      leaves: THREE.Group[]): ValidityChecker {
                return new ValidityChecker(stem, torus, stamens, petals, leaves)
            }

            /**
             * Indicate whether each stamen will be shown
             */
            private readonly stamensLottery: boolean[]
            /**
             * Indicate whether each leaf will be shown
             */
            private readonly leavesLottery: boolean[]

            stemInvalidated(): boolean {
                return this.stem.scale.y <= 1
            }

            torusInvalidated(): boolean {
                return this.stem.scale.y >= 0.7
            }

            stamensInvalidated(): boolean[] {
                if (this.torusInvalidated()) {
                    return this.stamensLottery
                } else {
                    return util.fillArray(Array(this.stamens.length), false) // all false
                }
            }

            petalsInvalidated(): boolean {
                return this.stem.scale.y >= 0.61 && this.petals[0].position.y <= 41
            }

            leavesInvalidities(): boolean[] {
                return util.andBooleanArrays(this.leavesLottery, [
                    this.stem.scale.y >= 0.3 && this.leaves[0].position.y <= 10,
                    this.stem.scale.y >= 0.4 && this.leaves[1].position.y <= 15,
                    this.stem.scale.y >= 0.45 && this.leaves[2].position.y <= 20,
                    this.stem.scale.y >= 0.52 && this.leaves[3].position.y <= 24,
                    this.stem.scale.y >= 0.55 && this.leaves[4].position.y <= 27,
                    this.stem.scale.y >= 0.6 && this.leaves[5].position.y <= 31,
                ])
            }
        }

        /**
         * Update stem object
         * @param {Group} stem - stem object
         * @impure
         */
        function updateStem(stem: THREE.Group): void {
            if (stem.scale.y <= 1) {
                stem.scale.y += 0.001
            }
            if (stem.scale.z <= 1) {
                stem.scale.z += 0.005
            }
        }

        /**
         * Update torus object and stamen objects
         * @param {Group} torus - torus object
         * @param {Group[]} stamens - stamen objects
         * @param {boolean} torusInvalidated - the invalidity of torus
         * @param {boolean[]} stamenInvalidities - the invalidity of each stamen
         * @impure
         */
        function updateTorusAndStamens(torus: THREE.Group, stamens: THREE.Group[],
                                       torusInvalidated: boolean, stamenInvalidities: boolean[]): void {
            if (torusInvalidated) {
                torus.visible = true
                if (torus.scale.x <= 0.1) {
                    torus.scale.x += 0.00035
                    torus.scale.y += 0.00025
                    torus.scale.z += 0.00035
                }
                if (torus.position.y <= 41.5) {
                    torus.position.y += 0.04
                }
            }
            const firstInvalidatedStamen: THREE.Group | null =
                util.first(stamens, (item: THREE.Group, index: number) => stamenInvalidities[index])
            if (firstInvalidatedStamen !== null
                && (firstInvalidatedStamen.scale.x <= 0.12 || torus.position.y <= 41.5)) {
                for (let i = 0; i < stamens.length; i++) {
                    const stamen: THREE.Group = stamens[i]
                    const invalidated: boolean = stamenInvalidities[i]
                    if (invalidated) {
                        stamen.visible = true
                        if (firstInvalidatedStamen.scale.x <= 0.12) {
                            stamen.scale.x += 0.0003
                            stamen.scale.y += 0.0003
                            stamen.scale.z += 0.0003
                        }
                        if (torus.position.y <= 41.5) {
                            stamen.position.y += 0.04
                        }
                    }
                }
            }
        }

        /**
         * Update petal objects
         * @param {Group[]} petals - petal objects
         * @impure
         */
        function updatePetals(petals: THREE.Group[]): void {
            for (const petal of petals) {
                petal.visible = true
            }
            if (petals[0].position.y <= 41) {
                for (const petal of petals) {
                    petal.position.y += 0.042
                }
            }
            if (petals[0].scale.x <= 1) {
                for (const petal of petals) {
                    petal.scale.x += 0.004
                    petal.scale.y += 0.004
                    petal.scale.z += 0.004
                }
            }

            // petal 0
            if(petals[0].rotation.x >= 0.7)
                petals[0].rotation.x -= 0.003
            // petal 1
            if(petals[1].rotation.x >= 0.7)
                petals[1].rotation.x -= 0.003
            if(petals[1].rotation.z <=0)
                petals[1].rotation.z += 0.003
            // petal 2
            if(petals[2].rotation.x <= 0.7)
                petals[2].rotation.x += 0.005
            if(petals[2].rotation.z >= 0)
                petals[2].rotation.z -= 0.006
            // petal 3
            if(petals[3].rotation.x <= 0.7)
                petals[3].rotation.x += 0.003
            if (petals.length >= 5) {
                // petal 4
                if (petals[4].rotation.x <= 0.7)
                    petals[4].rotation.x += 0.005
                if (petals[4].rotation.z <= 0)
                    petals[4].rotation.z += 0.0065
                if (petals.length >= 6) {
                    // petal 5
                    if (petals[5].rotation.x >= 0.7)
                        petals[5].rotation.x -= 0.005
                    if (petals[5].rotation.z >= 0)
                        petals[5].rotation.z -= 0.0065
                }
                if (petals.length >= 7) {
                    // petal 6
                    if (petals[6].rotation.x >= 0.7)
                        petals[6].rotation.x -= 0.005
                    if (petals[6].rotation.z >= 0)
                        petals[6].rotation.z -= 0.0065
                }
            }
        }

        /**
         * Update leaf objects
         * @param {Group[]} leaves - leaf objects
         * @param {boolean[]} invalidities - the invalidity of each leaf
         * @impure
         */
        function updateLeaves(leaves: THREE.Group[], invalidities: boolean[]): void {
            for (let i = 0; i < leaves.length; i++) {
                const leaf: THREE.Group = leaves[i]
                const invalidated: boolean = invalidities[i]
                if (invalidated) {
                    // show
                    leaf.visible = true
                    // positioning
                    leaf.position.y += 0.015
                    // scale
                    if (leaf.scale.x <= 1) {
                        leaf.scale.x += 0.004
                        leaf.scale.y += 0.004
                        leaf.scale.z += 0.002
                    }
                    // rotate
                    if (leaf.rotation.x <= util.random(-Math.PI * 0.2,-0.0015)) { // rotate positively
                        leaf.rotation.x += 0.0015
                    } else if (leaf.rotation.x >= util.random(0.0015, Math.PI * 0.2)) { // rotate negatively
                        leaf.rotation.x -= 0.0015
                    }
                }
            }
        }

        /**
         * Initiate the process of updating objects and rendering the scene
         * @param {WebGLRenderer} renderer - renderer
         * @param {Scene} scene - scene
         * @param {PerspectiveCamera} camera - camera
         * @param {Group} stem - stem object
         * @param {Group} torus - torus object
         * @param {Group[]} stamens - stamen objects
         * @param {Group[]} petals - petal objects
         * @param {Group[]} leaves - leaf objects
         * @impure
         */
        export function render(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera,
                        stem: THREE.Group, torus: THREE.Group,
                        stamens: THREE.Group[], petals: THREE.Group[], leaves: THREE.Group[]): void {
            const checker: ValidityChecker = ValidityChecker.of(stem, torus, stamens, petals, leaves);

            (function frame () {
                // stem
                if (checker.stemInvalidated()) {
                    updateStem(stem)
                }
                // torus and stamens
                updateTorusAndStamens(torus, stamens, checker.torusInvalidated(), checker.stamensInvalidated())
                // petals
                if (checker.petalsInvalidated()) {
                    updatePetals(petals)
                }
                // leaves
                updateLeaves(leaves, checker.leavesInvalidities())
                renderer.render(scene, camera)
                requestAnimationFrame(frame)
            })()
        }
    }

    /**
     * Initialize everything in scene
     * @returns {Promise<void>} nothing
     * @impure
     */
    export async function initialize(debug = false): Promise<void> {
        // renderer
        const renderer: THREE.WebGLRenderer = Renderer()
        dom.canvas().appendChild(renderer.domElement)

        // camera
        const camera: THREE.PerspectiveCamera = Camera()

        // scene
        const scene: THREE.Scene = Scene()

        // orbitControls
        const orbitControls: THREE.OrbitControls = OrbitControls(camera, renderer)
        orbitControls.update()

        // light
        scene.add(Light())

        if (debug) {
            // grid
            scene.add(GridHelper())
            // axes
            scene.add(AxesHelper())
        }

        // resize event
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        })
        // dispatch resize event
        window.dispatchEvent(new Event('resize'))

        // load objects
        const land: THREE.Group = await objectLoading.loadLand()
        const stem: THREE.Group = await objectLoading.loadStem()
        const torus: THREE.Group = await objectLoading.loadTorus()
        const stamens: THREE.Group[] = await objectLoading.loadStamens()
        const petals: THREE.Group[] = await objectLoading.loadPetals()
        const leaves: THREE.Group[] = await objectLoading.loadLeaves()

        // add objects to scene
        scene.add(land)
        scene.add(stem)
        scene.add(torus)
        for (const stamen of stamens) {
            scene.add(stamen)
        }
        for (const petal of petals) {
            scene.add(petal)
        }
        for (const leaf of leaves) {
            scene.add(leaf)
        }

        // fog
        scene.fog = new THREE.Fog(0xcce0ff, 50, 1000)

        // render
        rendering.render(renderer, scene, camera, stem, torus, stamens, petals, leaves)
    }
}

/**
 * Main entry point
 */
(async () => {
    polyfills.install()
    await control.initialize()
})()
