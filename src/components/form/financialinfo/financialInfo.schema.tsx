export type FeeRow = {
    key: number
    label: string
    years: { [year: string]: number | null }
}


export const tuitionSummary: FeeRow[] = [
    {
        key: 1,
        label: "A.1 Tuiton Fee per Unit",
        years: {
            "1st": 500,
            "2nd": 500,
            "3rd": 550,
            "4th": 600,
            "5th": 600,
        }

    },
    {
        key: 2,
        label: "      multiplied by average semestral/term academic load",
        years: {
            "1st": 12,
            "2nd": 16,
            "3rd": 22,
            "4th": 22,
            "5th": 10,
        }
    },
]


export const miscFeeSummary: FeeRow[] = [
    {
        key: 1,
        label: "Registration Fee",
        years: {
            "1st": 500,
            "2nd": 500,
            "3rd": 0,
            "4th": 600,
            "5th": 0,
        }
    },
    {
        key: 2,
        label: "Library Fee",
        years: {
            "1st": 300,
            "2nd": 0,
            "3rd": 350,
            "4th": 400,
            "5th": 0,
        }
    },
    {
        key: 3,
        label: "Laboratory Fee",
        years: {
            "1st": 0,
            "2nd": 900,
            "3rd": 0,
            "4th": 1100,
            "5th": 1200,
        }
    },
    {
        key: 4,
        label: "Athletic Fee",
        years: {
            "1st": 200,
            "2nd": 0,
            "3rd": 250,
            "4th": 0,
            "5th": 300,
        }
    },
    {
        key: 5,
        label: "Medical Fee",
        years: {
            "1st": 0,
            "2nd": 150,
            "3rd": 200,
            "4th": 0,
            "5th": 250,
        }
    },
    {
        key: 6,
        label: "Guidance Fee",
        years: {
            "1st": 100,
            "2nd": 0,
            "3rd": 120,
            "4th": 150,
            "5th": 0,
        }
    },
    {
        key: 7,
        label: "Technology Fee",
        years: {
            "1st": 0,
            "2nd": 650,
            "3rd": 700,
            "4th": 0,
            "5th": 800,
        }
    }
];