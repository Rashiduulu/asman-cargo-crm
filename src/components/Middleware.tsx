import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

//Администратор - Администратор

export const accessRules: any = {
  "/employee": [
    {
      group: "Супер-админ",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Администратор",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Руководитель",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Бухгалтер",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
  ],
  "/clients": [
    {
      group: "Супер-админ",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Администратор",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Менеджер",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Руководитель",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Бухгалтер",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
  ],
  "/routes": [
    {
      group: "Супер-админ",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Администратор",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Менеджер",
      privileges: {
        add: false,
        edit: false,
        delete: false,
      },
    },
    {
      group: "Руководитель",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Бухгалтер",
      privileges: {
        add: false,
        edit: false,
        delete: false,
      },
    },
  ],
  "/reception-transmission": [
    {
      group: "Супер-админ",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Администратор",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Менеджер",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Руководитель",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Бухгалтер",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
  ],
  "/finance": [
    {
      group: "Супер-админ",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Администратор",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Руководитель",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Бухгалтер",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
  ],
  "/warehouse": [
    {
      group: "Супер-админ",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Администратор",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Руководитель",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Бухгалтер",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Менеджер",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
  ],
  "/debits": [
    {
      group: "Супер-админ",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Администратор",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Руководитель",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Бухгалтер",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Менеджер",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
  ],
  "/trash": [
    {
      group: "Супер-админ",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      group: "Администратор",
      privileges: {
        add: true,
        edit: true,
        delete: true,
      },
    },
  ],
};

const MiddleWare = ({ children }: any) => {
  const location = useLocation();
  const user = useSelector((state: any) => state.user);
  const isOnLoginPage = location.pathname.includes("sign-in");

  if (user.authed) {
    if (isOnLoginPage) {
      return <Navigate to="/employee" replace />; // Redirect logged-in users on the login page to the home page.
    }
    if (location.pathname === "/") {
      return <Navigate to="/employee" replace />;
    }

    // Iterate over the keys (page names) in accessRules.
    for (const pageName in accessRules) {
      if (location.pathname.includes(pageName)) {
        const allowedRoles = accessRules[pageName];
        if (allowedRoles.some((role: any) => role.group.includes(user.group))) {
          return children; // Allow access to the page.
        } else {
          return <Navigate to="/employee" replace />;
        }
      }
    }

    // If there is no match in accessRules, allow access.
    return children;
  }

  if (!user.authed && !isOnLoginPage) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default MiddleWare;
