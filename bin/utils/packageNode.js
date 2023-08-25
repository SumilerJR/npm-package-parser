export default class PackageNode {
    constructor(name, version) {
        this.name = name;
        this.version = version;
        this.dependencies = [];
    }

    toString() {
        // return '(' + this.x + ', ' + this.y + ')';
    }
}
