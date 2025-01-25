interface DriveStructure {
    name: string;
    files: string[];
    dirs: DriveStructure[];
}

export default DriveStructure;