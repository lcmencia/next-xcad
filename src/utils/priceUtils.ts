import { setAveragePrice } from "../redux/services/priceSlice";
import { useEffect } from "react";

export function useAveragePrice(dispatch: any) {
  async function fetchAveragePrice() {
    try {
      const response = await fetch("/api/price", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      dispatch(setAveragePrice(Number(data.averagePrice)));
    } catch (error) {
      console.error("Failed to fetch the average price:", error);
    }
  }

  useEffect(() => {
    fetchAveragePrice();
  }, []);
}
