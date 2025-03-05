// epl-web/src/components/client/player/player.table.jsx
import BasePlayerTable from "../../shared/player/base.player.table.jsx";
import GenericTableContainer from "../../shared/generic/generic.table.container.jsx";

const ClientPlayerTable = () => {
    // Use the base table with correct URL prefix for client
    const baseTableProps = BasePlayerTable({
        urlPrefix: '/players/',
    });

    return (
        <GenericTableContainer
            tableProps={baseTableProps.tableProps}
            title="Player Table"
        />
    );
};

export default ClientPlayerTable;