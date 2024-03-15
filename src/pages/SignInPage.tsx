import React, {useState} from "react";
import userImg from "../assets/images/signInImages/user-img.png";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {CustomButton} from "../components/CustomButton";
import {useDispatch} from "react-redux";
import {SignInService} from "../service/SignInService";
import {jwtDecode} from "jwt-decode";
import {setCookie} from "typescript-cookie";
import {access_token_name, refresh_token_name} from "../https/axiosInstance";
import {login} from "../store/slices/userSlice";
import {checkModalResponse} from "../helpers/helpers";

const formInitialState = {
  values: {
    phone: "",
    password: "",
  },
  validation: {
    message: {
      phone: "",
      password: "",
    },
    error: {
      phone: false,
      password: false,
    },
  },
  showPassword: false,
  requested: false,
};

export const SignIn: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const [form, setForm] = useState(formInitialState);

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setForm({
      ...form,
      requested: true,
    });

    SignInService.GetToken(form.values)
      .then((res) => {
        // Get the current time in seconds
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);

        const accessDecode: any = jwtDecode(res.data.access);
        const refreshDecode: any = jwtDecode(res.data.refresh);

        const accessExpirationInSeconds = accessDecode.exp;
        const refreshExpirationInSeconds = refreshDecode.exp;

        // Calculate the difference in seconds
        const accessDifferenceInSeconds =
          accessExpirationInSeconds - currentTimeInSeconds;
        const refreshDifferenceInSeconds =
          refreshExpirationInSeconds - currentTimeInSeconds;

        // Convert the difference in seconds to days
        const accessDifferenceInDays =
          accessDifferenceInSeconds / (60 * 60 * 24);
        const refreshDifferenceInDays =
          refreshDifferenceInSeconds / (60 * 60 * 24);

        setCookie(access_token_name, res.data.access, {
          expires: accessDifferenceInDays,
        });
        setCookie(refresh_token_name, res.data.refresh, {
          expires: refreshDifferenceInDays,
        });

        // write a user

        dispatch(
          login({
            authed: true,
            full_name: res.data?.full_name,
            group: res.data?.group,
          })
        );
      })
      .catch((err) => {
        checkModalResponse(err.response.data, setForm, form);
      });
  };

  return (
    <section className="bg-signIn w-full h-[100vh] bg-[#FCFCFC] container-block">
      <div className="flex justify-center items-center h-full w-full">
        <div className="shadow-block rounded-[12px] px-[80px] py-[40px] bg-white ">
          <h2 className="text-[40px] font-bold mb-[60px] text-center">Вход</h2>

          <form onSubmit={submitForm} className="flex flex-col gap-[50px]">
            <div>
              <span className="text-[14px] text-[#636569]">Ваш номер</span>
              <div className="relative mt-[16px]">
                <img
                  className="absolute top-1 left-0 pr-3 flex items-center cursor-pointer"
                  src={userImg}
                  alt="img"
                />
                <input
                  type="text"
                  className="w-full text-[14px] pl-[34px] h-[38px] border-b-[2px] focus:border-b-[#1C61D5] outline-none"
                  required
                  value={form.values.phone}
                  aria-invalid={form.validation.error.phone ? "true" : "false"}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      values: { ...form.values, phone: e.target.value },
                    })
                  }
                />
                {form.validation.message && form.validation.error.phone && (
                  <div className="text-red-500 text-[12px]">
                    {form.validation.message.phone}
                  </div>
                )}
              </div>
            </div>

            <div>
              <span className="text-[14px] text-[#636569]">Пароль</span>
              <div className="relative mt-[16px]">
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pr-3 text-[#C6CAD0] flex items-center cursor-pointer"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>

                <input
                  className="w-full text-[14px] pl-[28px] h-[38px] border-b-[2px] focus:border-b-[#1C61D5] outline-none"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.values.password}
                  aria-invalid={
                    form.validation.error.password ? "true" : "false"
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      values: { ...form.values, password: e.target.value },
                    })
                  }
                />
                {form.validation.message && form.validation.error.password && (
                  <div className="text-red-500 text-[12px]">
                    {form.validation.message.password}
                  </div>
                )}
              </div>
            </div>

            <CustomButton
              onClick={submitForm}
              loading={form.requested}
              type="submit"
              className="py-[16px] px-[133px] text-white"
              text="Войти"
            />
          </form>
        </div>
      </div>
    </section>
  );
};
