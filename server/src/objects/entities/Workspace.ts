import WorkspaceRow from "../rows/WorkspaceRow";

class Workspace {

    public static readonly NULL: Workspace = new Workspace(0, "", "", false);

    public static ofRow(row: WorkspaceRow): Workspace {
        return new Workspace(row.id, row.name, row.description, row.admin);
    }

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

export default Workspace;
