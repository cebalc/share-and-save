class WorkspaceData {
    public id: number;
    public name: string;
    public description: string;
    public userIsAdmin: boolean;

    public constructor(id: number, name: string, description: string, userIsAdmin: boolean) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.userIsAdmin = userIsAdmin;
    }
}

export default WorkspaceData;
