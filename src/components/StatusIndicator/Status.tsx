import React, { MouseEvent, ReactNode, useState } from "react"
import cls from './StatusIndicator.module.sass'
import { classNames, Mods } from "helpers/classNames";

type StatusIndicatorType = 'ON' | 'OFF';
const typeClasses: Record<StatusIndicatorType, string> = {
  ON: cls.on,
  OFF: cls.off
};
interface StatusIndicatorProps {
  type?: StatusIndicatorType
  className?: string
}

const StatusIndicator = ({ className, type = "OFF" }: StatusIndicatorProps) => {
  const mods: Mods = {
    [typeClasses[type]]: true
  }

  return (
    <div className={classNames(cls.statusIndicator, mods, [className])}>

    </div>
  )
}

export default StatusIndicator