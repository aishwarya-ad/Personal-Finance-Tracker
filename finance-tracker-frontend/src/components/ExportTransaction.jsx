import { exportTransactions } from "../services/api";

const ExportTransactions = () => {
    const handleExport = async () => {
        try {
            await exportTransactions();
        } catch (error) {
            console.error('Error exporting transactions:', error);
        }
    };

    return (
        <div>
            <button onClick={handleExport}>Download Transactions</button>
        </div>
    );
};

export default ExportTransactions;
