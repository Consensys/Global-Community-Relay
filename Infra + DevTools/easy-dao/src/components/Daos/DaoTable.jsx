import React, { useState, useEffect, useMemo } from "react";
import { useTable } from "react-table";
import { getDAO } from "../../services/easyDAO";
import Loading from "../common/Loading";
import Web3 from "web3";
import "./Dao.css";

let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
}

const newTrade = () => {
  return {
    address: "0xirovnr;vrivmovmrpvorpvr",
    notional: "1 ETH",
    initialRate: "",
    pair: "EUR/USD",
    latestRate: "0.934",
    active: "No"
  };
};

const sanitizeDaoData = (data, addr) => {
  console.log("sanitize: data", data);
  console.log("sanitize: addr", addr);
  const {
    _entryFee,
    _members,
    _numProposals,
    _votingPeriod,
    _balance,
    _daoType
  } = data;

  return {
    address: addr,
    fee: String(Number(_entryFee) / 10 ** 18) + " ETH",
    members: _members,
    proposals: _numProposals,
    votingPeriod: String(Number(_votingPeriod) / (60 * 60)) + " hrs",
    balance: String(Number(_balance) / 10 ** 18) + " ETH",
    type: _daoType
  };
};

function DaoTable({ daos, setDaoFocusAddress }) {
  const [daoData, setDaoData] = useState([]);
  const [loading, toggleLoading] = useState(true);

  useEffect(() => {
    const build = async () => {
      const allDaos = [];
      for (var i = 0; i < daos.length; i++) {
        let dao = await getDAO(daos[i]);
        dao = sanitizeDaoData(dao, daos[i]);
        allDaos.push(dao);
      }

      setDaoData(allDaos);
      toggleLoading(false);
    };
    build();
  }, [daos]);

  const columns = useMemo(() => [
    {
      Header: "DAOs",
      columns: [
        {
          Header: "Address",
          accessor: "address"
        },
        {
          Header: "Fee",
          accessor: "fee"
        },
        {
          Header: "Members",
          accessor: "members"
        },
        {
          Header: "Proposals",
          accessor: "proposals"
        },
        {
          Header: "Voting Period",
          accessor: "votingPeriod"
        },
        {
          Header: "Balance",
          accessor: "balance"
        },
        {
          Header: "Type",
          accessor: "type"
        }
      ]
    }
  ]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mt-4 pb-5">
      <Table
        columns={columns}
        data={daoData}
        setDaoFocusAddress={setDaoFocusAddress}
      />
    </div>
  );
}

function Table({ columns, data, setDaoFocusAddress }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data
  });

  return (
    <table {...getTableProps()} className="mx-auto">
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          
          const addr = row.cells[0].render("Cell").props.data[0].address;

          return (
            <tr
              {...row.getRowProps()}
              className="table-row-content"
              onClick={() => setDaoFocusAddress(addr)}
            >
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default DaoTable;
