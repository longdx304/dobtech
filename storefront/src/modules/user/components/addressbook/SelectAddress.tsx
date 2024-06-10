import { Input, List } from 'antd';
import { ChangeEvent, useEffect, useState } from 'react';

import { Tabs } from '@/components/Tabs';
import jsonAddress from '@/lib/data/address.json';

import _ from 'lodash';
import { Check } from 'lucide-react';
const { Search } = Input;

type Province = {
  Id: string;
  Name: string;
  Districts: District[];
};

type District = {
  Id: string;
  Name: string;
  Wards: {
    Id: string;
    Name: string;
    Level: string;
  }[];
};

type Ward = {
  Id: string;
  Name: string;
  Level: string;
};

type SelectAddressProps = {
  address: {
    province: string;
    district: string;
    ward: string;
  };
  onSelect: (province: string, district: string, ward: string) => void;
  onClose: () => void;
};

const SelectAddress = ({ address, onSelect, onClose }: SelectAddressProps) => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(
    address.province || null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(
    address.district || null
  );
  const [selectedWard, setSelectedWard] = useState<string | null>(
    address.ward || null
  );
  const [activeKey, setActiveKey] = useState<string>('province');
  const [items, setItems] = useState<any[]>([]);

  // set province, district, ward and close modal when all selected
  useEffect(() => {
    if (selectedProvince && selectedDistrict && selectedWard) {
      onSelect(selectedProvince, selectedDistrict, selectedWard);
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvince, selectedDistrict, selectedWard]);

  // Update tabs when selectedProvince or selectedDistrict changes
  useEffect(() => {
    updateTabs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvince, selectedDistrict]);

  const updateTabs = () => {
    const newItems = [
      {
        label: selectedProvince || 'Tỉnh/Thành phố',
        key: 'province',
        children: (
          <SelectProvince
            provinces={jsonAddress as Province[]}
            onProvinceSelect={handleProvinceSelect}
          />
        ),
        style: {
          height: '100vh',
          overflowY: 'auto',
          scrollbarWidth: 'none',
        },
      },
    ];

    if (selectedProvince) {
      const selectedProvinceData = jsonAddress.find(
        (item) => item.Name === selectedProvince
      );

      newItems.push({
        label: selectedDistrict || 'Quận/Huyện',
        key: 'district',
        children: (
          <SelectDistrict
            districts={selectedProvinceData?.Districts as District[]}
            onDistrictSelect={handleDistrictSelect}
          />
        ),
        style: {
          height: '100vh',
          overflowY: 'auto',
          scrollbarWidth: 'none',
        },
      });
    }

    if (selectedProvince && selectedDistrict) {
      const selectedProvinceData = jsonAddress.find(
        (item) => item.Name === selectedProvince
      );
      const selectedDistrictData = selectedProvinceData?.Districts.find(
        (item) => item.Name === selectedDistrict
      );

      newItems.push({
        label: selectedWard || 'Phường/Xã',
        key: 'ward',
        children: (
          <SelectWard
            wards={selectedDistrictData?.Wards as Ward[]}
            onWardSelect={handleWardSelect}
          />
        ),
        style: {
          height: '100vh',
          overflowY: 'auto',
          scrollbarWidth: 'none',
        },
      });
    }

    setItems(newItems);
  };

  const handleProvinceSelect = (province: string) => {
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setActiveKey('district');
  };

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district);
    setSelectedWard(null);
    setActiveKey('ward');
  };

  const handleWardSelect = (ward: string) => {
    setSelectedWard(ward);
    setActiveKey('province');
  };

  return (
    <Tabs
      activeKey={activeKey}
      onChange={(key) => setActiveKey(key)}
      tabBarStyle={{ position: 'sticky', top: 0, zIndex: 100 }}
      items={items}
    />
  );
};

export default SelectAddress;

type SelectProvinceProps = {
  provinces: Province[];
  onProvinceSelect: (province: string) => void;
};

const SelectProvince = ({
  provinces,
  onProvinceSelect,
}: SelectProvinceProps) => {
  const [activeProvince, setActiveProvince] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');

  const filteredProvinces = provinces
    .filter((province) =>
      province?.Name.toLowerCase().includes(searchValue.toLowerCase())
    )
    .sort((a, b) => a.Name.localeCompare(b.Name));

  const onSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleChangeDebounce = _.debounce(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value: inputValue } = e.target;
      setSearchValue(inputValue);
    },
    500
  );

  return (
    <>
      <div className='sticky top-0 z-20'>
        <Search
          className='pb-4 [&_.ant-input-outlined:focus]:shadow-none [&_.ant-input-outlined]:rounded-none sticky'
          placeholder='Tỉnh/Thành phố'
          onSearch={onSearch}
          onChange={handleChangeDebounce}
          enterButton
        />
      </div>

      <List
        dataSource={filteredProvinces}
        renderItem={(province) => (
          <List.Item
            onClick={() => {
              onProvinceSelect(province.Name);
              setActiveProvince(province.Name);
            }}
            className={
              activeProvince === province.Name
                ? 'bg-[#f6f6f6] font-bold flex justify-start gap-2'
                : ''
            }
          >
            {province.Name}
            {activeProvince === province.Name && <Check size={16} />}
          </List.Item>
        )}
      />
    </>
  );
};

type SelectDistrictProps = {
  districts: District[];
  onDistrictSelect: (district: string) => void;
};

const SelectDistrict = ({
  districts = [],
  onDistrictSelect,
}: SelectDistrictProps) => {
  const [activeDistrict, setActiveDistrict] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');

  const filteredDistricts = districts
    .filter((district) =>
      district?.Name.toLowerCase().includes(searchValue.toLowerCase())
    )
    .sort((a, b) => a.Name.localeCompare(b.Name));

  const onSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleChangeDebounce = _.debounce(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value: inputValue } = e.target;
      setSearchValue(inputValue);
    },
    500
  );

  return (
    <>
      <div className='sticky top-0 z-20'>
        <Search
          className='pb-4 [&_.ant-input-outlined:focus]:shadow-none [&_.ant-input-outlined]:rounded-none'
          placeholder='Quận/Huyện'
          onSearch={onSearch}
          onChange={handleChangeDebounce}
          enterButton
        />
      </div>
      <List
        dataSource={filteredDistricts}
        renderItem={(district) => (
          <List.Item
            onClick={() => {
              onDistrictSelect(district.Name);
              setActiveDistrict(district.Name);
            }}
            className={
              activeDistrict === district.Name
                ? 'bg-[#f6f6f6] font-bold flex justify-start gap-2'
                : ''
            }
          >
            {district.Name}
            {activeDistrict === district.Name && <Check size={16} />}
          </List.Item>
        )}
      />
    </>
  );
};

type SelectWardProps = {
  wards: Ward[];
  onWardSelect: (ward: string) => void;
};

const SelectWard = ({ wards, onWardSelect }: SelectWardProps) => {
  const [activeWard, setActiveWard] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');

  const filteredWards = wards
    .filter((ward) =>
      ward?.Name?.toLowerCase().includes(searchValue.toLowerCase())
    )
    .sort((a, b) => a.Name.localeCompare(b.Name));

  const onSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleChangeDebounce = _.debounce(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value: inputValue } = e.target;
      setSearchValue(inputValue);
    },
    500
  );

  return (
    <>
      <div className='sticky top-0 z-20'>
        <Search
          className='pb-4 [&_.ant-input-outlined:focus]:shadow-none [&_.ant-input-outlined]:rounded-none'
          placeholder='Phường/Xã'
          onSearch={onSearch}
          onChange={handleChangeDebounce}
          enterButton
        />
      </div>
      <List
        dataSource={filteredWards}
        renderItem={(ward) => (
          <List.Item
            onClick={() => {
              onWardSelect(ward.Name);
              setActiveWard(ward.Name);
            }}
            className={
              activeWard === ward.Name
                ? 'bg-[#f6f6f6] font-bold flex justify-start gap-2'
                : ''
            }
          >
            {ward.Name}
            {activeWard === ward.Name && <Check size={16} />}
          </List.Item>
        )}
      />
    </>
  );
};
