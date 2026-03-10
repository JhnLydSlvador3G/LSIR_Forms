import { useAppForm } from "@/hooks/form-context";
import { ScheduleDefaultValues, ScheduleSchema, BlockValues } from "./Schedule.type";
import { ScheduleInstance } from "./ScheduleInstance";
import { useStore } from "@tanstack/react-form";
import { useMemo, useState } from "react";
import { Trash2, ChevronDown, ChevronRight } from "lucide-react";

function numToOrdinal(n: number) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function ScheduleForm() {
    const form = useAppForm({
        defaultValues: ScheduleDefaultValues,
        validators: {
            onChange: ScheduleSchema,
        },
    });

    const blocks = useStore(form.store, (s) => s.values.blocks);

    // Track open/closed state per year
    const [openYears, setOpenYears] = useState<Record<string, boolean>>({});

    // Toggle year open state
    const toggleYear = (year: string) => {
        setOpenYears((prev) => ({ ...prev, [year]: !prev[year] }));
    };

    const groupedBlocks = useMemo(() => {
        const grouped = blocks.reduce<Record<string, { index: number; block: BlockValues }[]>>(
            (acc, block, index) => {
                const year = block.year_level;
                if (!acc[year]) acc[year] = [];
                acc[year].push({ index, block });
                return acc;
            },
            {}
        );

        return Object.entries(grouped).sort((a, b) => Number(a[0]) - Number(b[0]));
    }, [blocks]);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="space-y-4"
        >
            {/* Main title */}
            <h1 className="text-4xl font-bold text-center text-leb mb-6">
                Class Schedule
            </h1>

            {groupedBlocks.map(([year, yearBlocks]) => {
                const isOpen = openYears[year] ?? true; // default open
                return (
                    <div key={year} className="border rounded-lg mb-6 shadow-sm overflow-hidden">
                        {/* Year Header */}
                        <button
                            type="button"
                            onClick={() => toggleYear(year)}
                            className="flex items-center justify-center gap-2 w-full bg-leb/10 text-leb py-2 font-semibold text-2xl border-b border-leb/20 hover:bg-leb/20 transition"
                        >
                            {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                            <span>{numToOrdinal(Number(year))} Year</span>
                        </button>

                        {/* Blocks (collapsible) */}
                        {isOpen && (
                            <div className="flex flex-col gap-4 p-4">
                                {yearBlocks.map(({ index }) => (
                                    <div
                                        key={index}
                                        className="flex flex-col items-center justify-between gap-4 border rounded p-3 hover:bg-gray-50 transition"
                                    >
                                        <ScheduleInstance form={form} fields={`blocks[${index}]`} />

                                        <button
                                            type="button"
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 rounded-md transition font-medium"
                                            onClick={() => form.removeFieldValue("blocks", index)}
                                        >
                                            <Trash2 size={20} />
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}

            <button
                type="button"
                onClick={() =>
                    form.pushFieldValue("blocks", { ...ScheduleDefaultValues.blocks[0] })
                }
                className="mt-4 mx-3 px-4 py-2 bg-lebSecond text-black rounded"
            >
                Add Section
            </button>
            <button type="submit" className="mt-2 px-4 py-2 bg-leb text-white rounded">
                Save Schedule
            </button>
        </form>
    );
}