import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Logo from "../assets/images/logo.png";
import {
  BsGrid3X3GapFill,
  BsCalculatorFill,
  BsFillPersonFill,
} from "react-icons/bs";
import {
  MdFileCopy,
  MdMonetizationOn,
  MdDashboard,
  MdDelete,
  MdAccountCircle,
} from "react-icons/md";

import { FaChevronRight } from "react-icons/fa";

interface LinkItem {
  id: number;
  name: string;
  link?: string;
  image: JSX.Element;
  hasDropdown?: boolean;
  dropdownItems?: { id: number; name: string; link: string }[];
}

export const SideBar: React.FC = () => {
  const location = useLocation();

  const links: LinkItem[] = [
    {
      id: 1,
      name: "Сотрудники",
      link: "/employee",
      image: <MdAccountCircle />,
    },
    {
      id: 2,
      name: "Клиенты ",
      link: "/clients/consignees",
      image: <BsFillPersonFill />,
    },
    {
      id: 3,
      name: "Рейсы",
      link: "/routes",
      image: <BsGrid3X3GapFill />,
    },
    {
      id: 4,
      name: "Приём/ передача",
      link: "/reception-transmission",
      image: <MdFileCopy />,
    },
    {
      id: 5,
      name: "Финансы",
      image: <MdMonetizationOn />,
      hasDropdown: true,
      dropdownItems: [
        { id: 1, name: "Касса", link: "/finance/box-office" },
        { id: 2, name: "Операции", link: "/finance/transactions" },
        { id: 3, name: "Авансы", link: "/finance/prepayment" },
        { id: 4, name: "Штрафы", link: "/finance/fines" },
        { id: 5, name: "Зарплаты", link: "/finance/salaries" },
      ],
    },
    {
      id: 6,
      name: "Склад",
      image: <MdDashboard />,
      link: "/warehouse",
    },
    {
      id: 7,
      name: "Дебиторка",
      image: <BsCalculatorFill />,
      hasDropdown: true,
      dropdownItems: [
        {
          id: 1,
          name: "Отчет дебиторки",
          link: "/debits/debits-report",
        },
        {
          id: 2,
          name: "Отчет дебиторки клиента",
          link: "/debits/client-debits-report",
        },
      ],
    },
    {
      id: 8,
      name: "Корзина",
      image: <MdDelete />,
      hasDropdown: true,
      dropdownItems: [
        { id: 1, name: "Рейсы", link: "/trash/routes" },
        {
          id: 2,
          name: "Прием / Передача",
          link: "/trash/reception-transmission",
        },
        { id: 3, name: "Операции", link: "/trash/operations" },
        // { id: 4, name: "Приходник", link: "/trash/incoming-goods" },
      ],
    },
  ];

  const [dropdownOpen, setDropdownOpen] = useState<{ [key: number]: boolean }>(
    {}
  );

  const handleDropdownToggle = (id: number) => {
    setDropdownOpen((prev: any) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="z-[998] max-h-[100dvh] w-[291px] rounded-br-[10px] overflow-y-auto fixed top-0 left-0 flex justify-center bg-[#CFE5FE] pt-[40px] drop-shadow-lg">
      <div className="w-full px-[31px]">
        <div className="flex justify-center">
          <img className="w-[139px] object-contain" src={Logo} alt="img" />
        </div>

        <div className="flex flex-col mt-[34px] pb-[20px] gap-[14px]">
          {links.map((item) => (
            <div key={item.id}>
              {item.hasDropdown ? (
                <div
                  className={`transition duration-300 flex items-center justify-between border-l-[4px] rounded-[4px] cursor-pointer px-[18px] py-[8px] ${
                    location.pathname === item.link
                      ? "border-[#1C61D5] text-[#1C61D5] bg-white"
                      : "border-transparent"
                  }`}
                  onClick={() => handleDropdownToggle(item.id)}
                >
                  <div className="flex gap-[10px]">
                    <span className="text-[20px]">{item.image} </span>
                    <h4 className="text-[14px]">{item.name}</h4>
                  </div>

                  <span
                    className={`ml-2 cursor-pointer transition-transform transform ${
                      dropdownOpen[item.id] ? "rotate-90" : ""
                    }`}
                  >
                    <FaChevronRight />
                  </span>
                </div>
              ) : (
                <Link
                  to={item.link || ""}
                  key={item.id}
                  onClick={() =>
                    setDropdownOpen((prev: any) => ({
                      ...prev,
                      [item.id]: false,
                    }))
                  }
                >
                  <div
                    className={`transition duration-300 flex items-center gap-[10px] border-l-[4px] rounded-[4px] cursor-pointer px-[18px] py-[8px] ${
                      location.pathname === item.link
                        ? "border-[#1C61D5] text-[#1C61D5] bg-white"
                        : "border-transparent"
                    }`}
                  >
                    <span className="text-[20px]">{item.image}</span>
                    <h4 className="text-[14px]">{item.name}</h4>
                  </div>
                </Link>
              )}

              {item.hasDropdown &&
                dropdownOpen[item.id] &&
                item.dropdownItems && (
                  <div className="ml-[32px] mt-2 w-auto flex flex-col gap-[10px] text-[14px] cursor-pointer transition-opacity opacity-100">
                    {item.dropdownItems.map((dropdownItem) => (
                      <Link to={dropdownItem.link || ""} key={dropdownItem.id}>
                        <div
                          className={`transition duration-300 flex items-center border-l-[4px] rounded-[4px] cursor-pointer px-[18px] py-[8px] ${
                            location.pathname === dropdownItem.link
                              ? "border-[#1C61D5] text-[#1C61D5] bg-white"
                              : "border-transparent"
                          }`}
                        >
                          {dropdownItem.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
