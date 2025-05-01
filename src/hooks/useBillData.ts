// hooks/useBillData.ts
import { useState, useEffect } from 'react';
import { useBilloq } from './useBilloq';

interface Biller {
    _id: string;
    id: number;
    biller_code: string;
    category_code: string;
    country_code: string;
    description: string;
    last_updated: string;
    logo: string | null;
    name: string;
    short_name: string;
    item_code: string;
  }
  
interface BillItem {
    _id: string;
    id: number;
    amount: number;
    biller_code: string;
    biller_name: string;
    category_name: string;
    commission_on_fee: boolean;
    commission_on_fee_or_amount: number;
    country: string;
    date_added: string;
    default_commission: number;
    default_commission_on_amount: number;
    fee: number;
    group_name: string;
    is_airtime: boolean;
    is_data: boolean | null;
    is_resolvable: boolean;
    item_code: string;
    label_name: string;
    last_updated: string;
    name: string;
    reg_expression: string;
    short_name: string;
    validity_period: string;
    category: string;
  }

export function useBillData() {
  const { getBillItems, getBillersByCategory } = useBilloq();
  const [allBillers, setAllBillers] = useState<Biller[]>([]);
  const [allBillItems, setAllBillItems] = useState<BillItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allCategories = [
    { name: "Airtime", code: "AIRTIME", items: "AIRTIME" },
    { name: "Data", code: "MOBILEDATA", items: "MOBILE" },
    { name: "Cable", code: "CABLEBILLS", items: "CABLE" },
    { name: "Electricity", code: "UTILITYBILLS", items: "ELECTRICITY" },
  ];

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Step 1: Fetch all billers for each category
      const billersPromises = allCategories.map(async (category) => {
        try {
          const response = await getBillersByCategory(category.code);
          return response.data.map((biller: any) => ({
            ...biller,
            item_code: category.items
          }));
        } catch (err) {
          console.error(`Error fetching billers for ${category.name}:`, err);
          return [];
        }
      });

      const billersResults = await Promise.all(billersPromises);
      const allBillersData = billersResults.flat();
      setAllBillers(allBillersData);

      // Step 2: Fetch all bill items for each biller
      const itemsPromises = allBillersData.map(async (biller) => {
        try {
          if (biller.biller_code === 'BIL127') {
            return [];
          }
          const response = await getBillItems(biller.item_code, biller.biller_code);
          return response.data.map((item: any) => ({
            ...item,
            category: biller.item_code,
          }));
        } catch (err) {
          console.error(`Error fetching items for ${biller.name}:`, err);
          return [];
        }
      });

      const itemsResults = await Promise.all(itemsPromises);
      const allBillItemsData = itemsResults.flat();
      setAllBillItems(allBillItemsData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bill data');
      console.error('Error fetching all bill data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    allBillers,
    allBillItems,
    loading,
    error,
    refresh: fetchAllData
  };
}