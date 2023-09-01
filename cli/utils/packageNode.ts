export default class PackageNode {
    public name
    public version
    public dependencies
    public devDependencies
    constructor(name, version) {
        this.name = name;
        this.version = version;
        this.dependencies = [];
        this.devDependencies = []
    }

    toString() {
        // return '(' + this.x + ', ' + this.y + ')';
    }
}
