import { useRef } from "react";
import { useSliderState } from '@react-stately/slider';
import { AriaSliderProps, useSlider } from "@react-aria/slider";
import { Thumb } from "./Thumb";
import { useNumberFormatter } from "@react-aria/i18n";
import cls from './Slider.module.sass';
import { NumberFormatOptions } from "@internationalized/number";

export type SliderTextType = 'bottom' | 'tooltip-top' | 'none';
type SliderThumbType = 'single' | 'range';

export interface SliderProps extends AriaSliderProps {
  formatOptions?: NumberFormatOptions;
  text?: SliderTextType;
  type?: SliderThumbType;
};

export const Slider = (props: SliderProps) => {
  const trackRef = useRef(null);
  const numberFormatter = useNumberFormatter(
    props.formatOptions
  );
  const state = useSliderState({ ...props, numberFormatter });
  const {
    groupProps,
    trackProps
  } = useSlider(props, state, trackRef);
  const {
    text = 'bottom',
    type = 'single'
  } = props;
  return (
    <div className={cls.sliderWrapper} {...groupProps}>
      {text === 'tooltip-top' && <div className={cls.outputContainerTooltipTop} />}
      <div
        {...trackProps}
        ref={trackRef}
        className={cls.slider}>
        <div
          className={cls.line}

        />
        {type === 'range' && <div className={cls.progress}
          style={{ left: `${state.getThumbPercent(0) * 100}%`, width: `${state.getThumbPercent(1) * 100 - state.getThumbPercent(0) * 100}%` }}
        />}
        <Thumb
          index={0}
          state={state}
          trackRef={trackRef}
          text={text}
        />
        {type === 'range' && <Thumb
          index={1}
          state={state}
          trackRef={trackRef}
          text={text}
        />}
      </div>
      {text === 'bottom' && <div className={cls.outputContainer} />}
    </div>
  );
}