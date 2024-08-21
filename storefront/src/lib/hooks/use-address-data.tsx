import { useState, useEffect } from 'react';

interface Ward {
  Id: string;
  Name: string;
  Level: string;
}

interface District {
  Id: string;
  Name: string;
  Wards: Ward[];
}

interface Province {
  Id: string;
  Name: string;
  Districts: District[];
}

const useAddressData = () => {
  const [addressData, setAddressData] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadAddressData = async () => {
      try {
        // Dynamically import the JSON data to keep it out of the initial bundle
        const data = (await import('@/lib/data/address.json')).default as Province[];
        setAddressData(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load address data'));
      } finally {
        setLoading(false);
      }
    };

    loadAddressData();
  }, []);

  const getProvinces = (): Province[] => addressData;

  const getDistricts = (provinceName: string): District[] => {
    const province = addressData.find(p => p.Name === provinceName);
    return province ? province.Districts : [];
  };

  const getWards = (districtName: string): Ward[] => {
    for (const province of addressData) {
      const district = province.Districts.find(d => d.Name === districtName);
      if (district) return district.Wards;
    }
    return [];
  };

  return {
    loading,
    error,
    addressData,
    getProvinces,
    getDistricts,
    getWards,
  };
};

export default useAddressData;
