import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart } from "@mui/x-charts/LineChart";

const CombinedChart = () => {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const fetchData = async () => {
    try {
      const responseUsers = await axios.get("http://34.101.102.183:3000/users");
      const responseTransactions = await axios.get(
        "http://34.101.102.183:3000/transactions"
      );

      setUsers(responseUsers.data);
      setTransactions(responseTransactions.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to get monthly user registration data
  const getMonthlyUserData = () => {
    const monthlyData = {};

    users.forEach((user) => {
      const date = new Date(user.createdAt);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = 1;
      } else {
        monthlyData[monthYear] += 1;
      }
    });

    return monthlyData;
  };

  // Function to get monthly transaction data
  const getMonthlyTransactionData = () => {
    const monthlyData = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.createdAt);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = 1;
      } else {
        monthlyData[monthYear] += 1;
      }
    });

    return monthlyData;
  };
  // Combine user and transaction data
  const combinedData = () => {
    const userData = getMonthlyUserData();
    const transactionData = getMonthlyTransactionData();

    const combined = Object.keys(userData).map((key) => ({
      monthYear: key,
      newUser: userData[key],
      transaction: transactionData[key] || 0,
    }));

    return combined;
  };
  const data = combinedData();
  const xData = data.map((dataPoint) => dataPoint.newUser);
  const yData = data.map((dataPoint) => dataPoint.transaction);
  console.log(combinedData());
  return (
    <div>
      {data.length > 0 && (
        <div>
          <h2>Combined Users and Transactions Chart</h2>
          <LineChart
            xAxis={[
              {
                scaleType: "point",
                data: [
                  "",
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ],
              },
            ]}
            series={[
              { curve: "linear", data: xData, label: "User" },
              { curve: "linear", data: yData, label: "Transaction" },
            ]}
            width={1000}
            height={400}
          />
        </div>
      )}
      {data.length === 0 && <div>Data not available</div>}
    </div>
  );
};

export default CombinedChart;
