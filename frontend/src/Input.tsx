import { Icon } from "@iconify/react/dist/iconify.js";

function Input({
  name,
  icon,
  value,
  onChange,
  disabled = false,
}: {
  name: string;
  icon: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}) {
  return (
    <div className="relative w-full min-w-[120px] h-14 group">
      <div className="absolute grid w-5 h-5 place-items-center text-zinc-500 group-focus-within:text-zinc-100 top-1/2 right-5 -translate-y-[55%]">
        <Icon icon={icon} className="w-6 h-6" />
      </div>
      <input
        value={value}
        onChange={onChange}
        name={name}
        disabled={disabled}
        className="w-full h-full px-3 py-3 font-sans text-base font-normal transition-all bg-transparent border rounded-md peer text-zinc-200 outline outline-0 focus:outline-0 placeholder-shown:border-[1.5px] placeholder-shown:border-zinc-700 placeholder-shown:border-t-zinc-700 focus:border-2 border-t-transparent focus:border-t-transparent border-zinc-700 focus:border-zinc-200"
        placeholder=" "
      />
      <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-zinc-500 leading-[0.8] peer-focus:font-medium peer-focus:leading-[0.8] transition-all -top-[5px] peer-placeholder-shown:text-base text-[14px] peer-focus:text-[14px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-placeholder-shown:leading-[4.1] text-zinc-500 peer-focus:text-zinc-200 before:border-zinc-700 peer-focus:before:!border-zinc-200 after:border-zinc-700 peer-focus:after:!border-zinc-200">
        {name}
      </label>
    </div>
  );
}

export default Input;
