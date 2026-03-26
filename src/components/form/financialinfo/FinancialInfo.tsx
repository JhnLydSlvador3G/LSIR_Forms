import TotalTable from "./tables/TotalTable";
import { ColumnFactoryConfig } from "./tableColumns";
import { createTable } from './tableFactory';

const columnTuitonConfig: ColumnFactoryConfig = {
    labelHeader: "Recuring Semestral/Term Fees",
    dataKey: 'tuitionData',
    editableCell: true,
    editableLabel: false,
    showAction: false,
    operation: 'mult',
    labelFooter: "Total averge tuition fee per semester/term",
}

const columnNonRecurConfig: ColumnFactoryConfig = {
    labelHeader: "Non-Recurring/Non-Semestral Fees",
    dataKey: 'nonrecurData',
    editableCell: true,
    editableLabel: true,
    showAction: true,
    operation: 'add',
    labelFooter: 'Total Non-Recurring/Non-Semesteral(Term) Fees'
}

const columnMiscConfig: ColumnFactoryConfig = {
    labelHeader: "Miscellaneous/OtherFee",
    dataKey: 'miscData',
    editableCell: true,
    editableLabel: true,
    showAction: true,
    operation: 'add',
    labelFooter: 'Total miscellaneous/other fees',
}



export default function FinancialInfo() {

    return (
        <div className="flex flex-col justify-center overflow-auto">
            {createTable({
                dataKey: 'tuitionData',
                config: columnTuitonConfig,
            })}
            {createTable({
                dataKey: 'miscData',
                config: columnMiscConfig,
            })}
            <TotalTable />
            {createTable({
                dataKey: 'nonrecurData',
                config: columnNonRecurConfig,
            })}
        </div>
    )
}