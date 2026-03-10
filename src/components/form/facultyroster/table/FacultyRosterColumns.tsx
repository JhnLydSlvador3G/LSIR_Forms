import { createColumnHelper } from "@tanstack/react-table";
import { FacultyRosterData } from "../FacultyRoster.type";

const columnHelper = createColumnHelper<FacultyRosterData>();

export const columns = [
    // Faculty Member Group
    columnHelper.group({
        header: "Faculty Member",
        columns: [
            columnHelper.accessor("lastName", {
                header: "Last Name",
                size: 200,
                cell: info => info.getValue(),
            }),
            columnHelper.accessor("firstName", {
                header: () => "First Name",
                cell: info => info.getValue(),
            }),
            columnHelper.accessor("middleName", {
                header: "Middle Initial",
                cell: info => info.getValue(),
            }),
        ],
    }),

    // Gender
    columnHelper.accessor("gender", {
        header: "Gender",
        cell: info => info.getValue(),
        footer: props => props.column.id,
    }),

    // Employment
    columnHelper.accessor("heiEmploymentStatus", {
        header: "Employment",
        cell: info => info.getValue(),
    }),

    // Highest Law Degree Group
    columnHelper.group({
        id: "Law Degree Info",
        header: "Highest Law Degree Attained",
        columns: [
            columnHelper.accessor("highestLawDegree.degree", {
                header: "Degree",
                cell: info => info.getValue(),
            }),
            columnHelper.accessor("highestLawDegree.grantingHEI", {
                header: "Granting HEI",
                cell: info => info.getValue(),
            }),
            columnHelper.accessor("highestLawDegree.year", {
                header: "Year",
                cell: info => info.getValue(),
            }),
        ],
    }),

    // Subjects
    columnHelper.accessor("subjects", {
        header: "Assigned Subjects to Teach",
        cell: info => info.getValue().join(", "),
    }),

    // Years Teaching
    columnHelper.accessor("yearsTeaching", {
        size: 2,
        maxSize: 3,
        header: "Years Teaching",
        cell: info => info.getValue(),
    }),

    // Professional Experience
    columnHelper.accessor("relevantToTeachingLoad", {
        header: () => <div className="text-wrap">Professional experience/work relevant to teaching load</div>,
        cell: info => info.getValue(),
    }),

    columnHelper.accessor("professionalExperienceYears", {
        header: "Professional Experience",
        cell: info => info.getValue(),
    }),

    columnHelper.display({
        id: 'actions',
        header: "Actions",
        cell: props => <button>DELETE</button>,
    }),

];