import clsx from "clsx"
import type { HTMLProps, InputHTMLAttributes } from "react"
import { useEffect, useRef, useState } from "react"

export function Switch({ ...props }: HTMLProps<HTMLInputElement>) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={props.checked}
        className="sr-only peer"
        onChange={props.onChange}
      />
      <div className={clsx("w-9 h-5 bg-primary bg-op-15 peer-focus:outline-none peer-focus:ring-0  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary", props.className)} />
    </label>
  )
}

export function Selector({ options, className, ...props }: { options: { value: string, label: string }[] } & HTMLProps<HTMLSelectElement>,
) {
  return (
    <select
      name="model"
      className={clsx(className, "w-full bg-slate bg-op-15 rounded appearance-none accent-slate text-center focus:(bg-op-20 ring-0 outline-none)")}
      {...props}
    >
      {
        options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)
      }
    </select>
  )
}

export function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (typeof indeterminate === "boolean")
      ref.current.indeterminate = !rest.checked && indeterminate
  }, [ref, indeterminate])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={clsx(className, "cursor-pointer accent-primary-600")}
      {...rest}
    />
  )
}

export function CheckBox({ options, ...props }: { options: { key: string, label: string, checked?: boolean }[] } & HTMLProps<HTMLInputElement>) {
  return (
    <div>
      {
        options.map(({ key, label, checked }) => (
          <div key={key}>
            <input
              type="checkbox"
              id={key}
              checked={checked}
              {...props}
            />
            <label className="ml-2" htmlFor={key}>{label}</label>
          </div>
        ))
      }
    </div>
  )
}

export function SettingItem({ ...props }: {
  children: React.ReactNode
  icon?: string
  label: string
} & HTMLProps<HTMLDivElement>) {
  return (
    <div className={clsx("flex items-center p1 justify-between hover:bg-slate hover:bg-op-10 rounded", props.className)}>
      <div className="flex items-center">
        <button type="button" className={props.icon} />
        <span className="">{props.label}</span>
      </div>
      {props.children}
    </div>
  )
}

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}
