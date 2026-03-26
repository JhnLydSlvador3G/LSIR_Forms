import { createColumnHelper } from "@tanstack/react-table";
import { FacultyRosterData } from "../FacultyRoster.type";
import { Pencil, Trash2 } from "lucide-react";

const columnHelper = createColumnHelper<FacultyRosterData>();

export const columns = [
    // Faculty Member Group
    columnHelper.accessor("id", {
        id: "id", // Explicitly set the ID for getValue calls
        header: "ID",
    }),
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
        cell: info => info.getValue()?.join(", "),
    }),

    columnHelper.accessor("professionalExperienceYears", {
        header: "Professional Experience",
        cell: info => info.getValue(),
    }),

    columnHelper.display({
        id: 'actions',
        header: "Actions",
        cell: props => (
            < div className="flex w-full items-center gap-1 justify-center" >
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        props.table.options.meta?.onEdit?.(props.row.getValue('id'));
                    }}
                    className="
      p-1.5 rounded-md
      bg-leb text-white
      hover:bg-leb/90
      active:bg-leb/80
      transition-colors
    "
                >
                    <Pencil size={14} />
                </button>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        props.table.options.meta?.onDelete?.(props.row.getValue('id'));
                    }}
                    className="
      p-1.5 rounded-md
      bg-red-500 text-white
      hover:bg-red-600
      active:bg-red-700
      transition-colors
    "
                >
                    <Trash2 size={14} />
                </button>
            </div >

        )
    }),

];