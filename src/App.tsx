import React, {
  useState,
  createContext,
  useContext,
  useMemo,
  memo,
  useCallback,
} from "react";
import { generateItems, renderLog } from "./utils";

type Theme = "light" | "dark";

// 타입 정의
interface Item {
  id: number;
  name: string;
  category: string;
  price: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  password: number;
}

interface Notification {
  id: number;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

//Context 정의
//테마
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

//회원 기능
interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

//noti
interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type: Notification["type"]) => void;
  removeNotification: (id: number) => void;
}

//ItemList

interface ItemListProps {
  theme: "light" | "dark";
  items: Item[];
  onAddItemsClick: () => void;
  filter: string;
  setFilter: (value: string) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);
const UserContext = createContext<UserContextType | null>(null);
const NotificationContext = createContext<NotificationContextType | null>(null);

//테마 바꾸기
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error("useTheme must be used within an ThemeProvider");
  return context;
};

//로그인 로그아웃
const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within an UserProvider");
  return context;
};

const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error("useNotification must be used within an UserProvider");
  return context;
};

// // 커스텀 훅: useAppContext
// const useAppContext = () => {
//   const context = useContext(AppContext);
//   if (context === undefined) {
//     throw new Error("useAppContext must be used within an AppProvider");
//   }
//   return context;
// };

// Header 컴포넌트
export const Header: React.FC = memo(() => {
  renderLog("Header rendered");
  const { theme, toggleTheme } = useTheme();
  const { user, login, logout } = useUser();

  const handleLogin = () => {
    // 실제 애플리케이션에서는 사용자 입력을 받아야 합니다.
    login("user@example.com", "password");
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">샘플 애플리케이션</h1>
        <div className="flex items-center">
          <button
            onClick={toggleTheme}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            {theme === "light" ? "다크 모드" : "라이트 모드"}
          </button>
          {user ? (
            <div className="flex items-center">
              <span className="mr-2">{user.name}님 환영합니다!</span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
});

// ItemList 컴포넌트
export const ItemList: React.FC<ItemListProps> = memo(
  ({ theme, items, onAddItemsClick, filter, setFilter }) => {
    renderLog("ItemList rendered");

    const filteredItems = useMemo(() => {
      return items.filter(
        (item) =>
          item.name.toLowerCase().includes(filter.toLowerCase()) ||
          item.category.toLowerCase().includes(filter.toLowerCase()),
      );
    }, [items, filter]);

    const totalPrice = filteredItems.reduce((sum, item) => sum + item.price, 0);

    const averagePrice = Math.round(totalPrice / filteredItems.length) || 0;

    return (
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">상품 목록</h2>
          <div>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs"
              onClick={onAddItemsClick}
            >
              대량추가
            </button>
          </div>
        </div>
        <input
          type="text"
          placeholder="상품 검색..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
        />
        <ul className="mb-4 mx-4 flex gap-3 text-sm justify-end">
          <li>검색결과: {filteredItems.length.toLocaleString()}개</li>
          <li>전체가격: {totalPrice.toLocaleString()}원</li>
          <li>평균가격: {averagePrice.toLocaleString()}원</li>
        </ul>
        <ul className="space-y-2">
          {filteredItems.map((item, index) => (
            <li
              key={index}
              className={`p-2 rounded shadow ${theme === "light" ? "bg-white text-black" : "bg-gray-700 text-white"}`}
            >
              {item.name} - {item.category} - {item.price.toLocaleString()}원
            </li>
          ))}
        </ul>
      </div>
    );
  },
);

// ComplexForm 컴포넌트
export const ComplexForm: React.FC = memo(() => {
  renderLog("ComplexForm rendered");
  const { addNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: 0,
    preferences: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification("폼이 성공적으로 제출되었습니다", "success");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) || 0 : value,
    }));
  };

  const handlePreferenceChange = (preference: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(preference)
        ? prev.preferences.filter((p) => p !== preference)
        : [...prev.preferences, preference],
    }));
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">복잡한 폼</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="이름"
          className="w-full p-2 border border-gray-300 rounded text-black"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="이메일"
          className="w-full p-2 border border-gray-300 rounded text-black"
        />
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
          placeholder="나이"
          className="w-full p-2 border border-gray-300 rounded text-black"
        />
        <div className="space-x-4">
          {["독서", "운동", "음악", "여행"].map((pref) => (
            <label key={pref} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={formData.preferences.includes(pref)}
                onChange={() => handlePreferenceChange(pref)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2">{pref}</span>
            </label>
          ))}
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          제출
        </button>
      </form>
    </div>
  );
});

// NotificationSystem 컴포넌트
export const NotificationSystem: React.FC = memo(() => {
  renderLog("NotificationSystem rendered");
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded shadow-lg ${
            notification.type === "success"
              ? "bg-green-500"
              : notification.type === "error"
                ? "bg-red-500"
                : notification.type === "warning"
                  ? "bg-yellow-500"
                  : "bg-blue-500"
          } text-white`}
        >
          {notification.message}
          <button
            onClick={() => removeNotification(notification.id)}
            className="ml-4 text-white hover:text-gray-200"
          >
            닫기
          </button>
        </div>
      ))}
    </div>
  );
});

// 메인 App 컴포넌트
const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>("light");
  const [items, setItems] = useState(() => generateItems(1000)); //여기?
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState("");

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  }, []);

  const addItems = useCallback(() => {
    setItems((prevItems) => [
      ...prevItems,
      ...generateItems(1000, prevItems.length),
    ]);
  }, []);

  const addNotification = useCallback(
    (message: string, type: Notification["type"]) => {
      const newNotification: Notification = {
        id: Date.now(),
        message,
        type,
      };
      setNotifications((prev) => [...prev, newNotification]);
    },
    [],
  );

  const login = useCallback(
    (email: string) => {
      setUser({ id: 1, name: "홍길동", email, password: 1234 }); // 임시로 맞춰주기기
      addNotification("성공적으로 로그인되었습니다", "success");
    },
    [addNotification],
  );

  const logout = useCallback(() => {
    setUser(null);
    addNotification("로그아웃되었습니다", "info");
  }, [addNotification]);

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  }, []);

  // const contextValue: AppContextType = {
  //   theme,
  //   toggleTheme,
  //   user,
  //   login,
  //   logout,
  //   notifications,
  //   addNotification,
  //   removeNotification,
  // };

  const themeValue = useMemo(() => ({ theme, toggleTheme }), [theme]);
  const userValue = useMemo(() => ({ user, login, logout }), [user]);
  const notificationValue = useMemo(
    () => ({ notifications, addNotification, removeNotification }),
    [notifications, addNotification, removeNotification],
  );

  return (
    <ThemeContext.Provider value={themeValue}>
      <UserContext.Provider value={userValue}>
        <NotificationContext.Provider value={notificationValue}>
          {/* <AppContext.Provider value={contextValue}> */}
          <div
            className={`min-h-screen ${theme === "light" ? "bg-gray-100" : "bg-gray-900 text-white"}`}
          >
            <Header />
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 md:pr-4">
                  <ItemList
                    theme={theme}
                    items={items}
                    onAddItemsClick={addItems}
                    filter={filter}
                    setFilter={setFilter}
                  />
                </div>
                <div className="w-full md:w-1/2 md:pl-4">
                  <ComplexForm />
                </div>
              </div>
            </div>
            <NotificationSystem />
          </div>
          {/* </AppContext.Provider> */}
        </NotificationContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;
