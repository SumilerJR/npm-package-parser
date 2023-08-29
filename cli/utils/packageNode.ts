export default class PackageNode {
    public name
    public version
    public dependencies = []
    constructor(name, version) {
        this.name = name;
        this.version = version;
    }

    toString() {
        // return '(' + this.x + ', ' + this.y + ')';
    }
}
