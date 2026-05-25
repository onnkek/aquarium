import { useEffect, useRef, useState } from 'react';

import cls from './ArchivePage.module.sass';

import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  Plugin,
  PointElement,
  TimeScale,
  Tooltip,
} from 'chart.js';

import { Page } from 'widgets/Page';

import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';

import { Line } from 'react-chartjs-2';

import { useAppDispatch, useAppSelector } from 'models/Hook';
import { useForm, useWatch } from 'react-hook-form';
import { fetchDoser, fetchPid, fetchRelay } from 'redux/EventsSlice';
import { fetchAirTemp, fetchHumidity, fetchWaterTemp } from 'redux/MetricsSlice';
import { classNames } from 'shared/lib/classNames';
import { formatDateForInput, getDateFromInput } from 'shared/lib/period';
import { validateDate } from 'shared/lib/validation';

ChartJS.register(
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
  Legend,
  CategoryScale,
  zoomPlugin
);

type RelayEvent = {
  name: 'HEAT' | 'COOL';
  time: number;
  status: 0 | 1;
};

type RelayVisibility = {
  HEAT: boolean;
  COOL: boolean;
};

const relayMarkersPlugin: Plugin = {
  id: 'relayMarkersPlugin',

  afterDraw(chart, _args, options: any) {
    const events: RelayEvent[] = options?.events || [];
    const visible: RelayVisibility = options?.visible || {
      HEAT: true,
      COOL: true,
    };

    const { ctx, chartArea, scales } = chart;

    events.forEach(e => {
      if (!visible[e.name]) return;

      const x = scales.x.getPixelForValue(e.time);
      const isCool = e.name === 'COOL';
      const isOn = e.status === 1;

      ctx.save();

      ctx.beginPath();
      ctx.moveTo(x, chartArea.top);
      ctx.lineTo(x, chartArea.bottom);
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = isCool ? '#38bdf8' : '#ef4444';
      ctx.stroke();

      ctx.fillStyle = ctx.strokeStyle;
      ctx.font = '12px sans-serif';
      ctx.fillText(isOn ? 'ON' : 'OFF', x + 6, chartArea.top + 14);

      ctx.restore();
    });
  },
};

ChartJS.register(relayMarkersPlugin);

type FormData = {
  date: string;
};

function ChartSkeleton({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className={cls.skeletonCard}>
      <div className={cls.skeletonTop}>
        <div className={cls.skeletonTitle} />
        <div className={cls.skeletonSubtitle} />
      </div>

      <div className={cls.skeletonLegend}>
        <div className={cls.skeletonLegendItem}>
          <span className={cls.skeletonDot} />
          <div className={cls.skeletonLegendText} />
        </div>
        <div className={cls.skeletonLegendItem}>
          <span className={cls.skeletonDot} />
          <div className={cls.skeletonLegendText} />
        </div>
        <div className={cls.skeletonLegendItem}>
          <span className={cls.skeletonDot} />
          <div className={cls.skeletonLegendText} />
        </div>
      </div>

      <div className={cls.skeletonChart}>
        <div className={cls.skeletonYAxis}>
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className={cls.skeletonPlot}>
          <div className={cls.skeletonGridLines}>
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className={cls.skeletonWaveOne} />
          <div className={cls.skeletonWaveTwo} />
          <div className={cls.skeletonWaveThree} />
        </div>
      </div>

      <div className={cls.skeletonFooter}>
        <div className={cls.skeletonFooterTick} />
        <div className={cls.skeletonFooterTick} />
        <div className={cls.skeletonFooterTick} />
        <div className={cls.skeletonFooterTick} />
        <div className={cls.skeletonFooterTick} />
      </div>

      <div className={cls.skeletonMeta}>
        <span>{title}</span>
        <span>{subtitle}</span>
      </div>
    </div>
  );
}

export function ArchivePage() {
  const dispatch = useAppDispatch();
  const fertRef = useRef<any>(null);
  const tempRef = useRef<any>(null);
  const eventsRef = useRef<any>(null);

  const {
    register,
    trigger,
    control,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      date: formatDateForInput(new Date(Date.now())),
    },
  });

  const selectedDate = useWatch({
    control,
    name: 'date',
  });

  const metrics = useAppSelector(state => state.metrics.data);
  const events = useAppSelector(state => state.events);

  const [relayVisible, setRelayVisible] = useState<RelayVisibility>({
    HEAT: true,
    COOL: true,
  });

  const [tempLoading, setTempLoading] = useState(false);
  const [fertLoading, setFertLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);

  useEffect(() => {
    trigger();
  }, [trigger]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const date = getDateFromInput(selectedDate);

      setTempLoading(true);
      setFertLoading(true);
      setEventsLoading(true);

      try {
        await dispatch(fetchAirTemp(date)).unwrap();
        if (cancelled) return;

        await dispatch(fetchWaterTemp(date)).unwrap();
        if (cancelled) return;

        await dispatch(fetchHumidity(date)).unwrap();
        if (cancelled) return;

        setTempLoading(false);

        await dispatch(fetchDoser(date)).unwrap();
        if (cancelled) return;

        setFertLoading(false);

        await dispatch(fetchPid(date)).unwrap();
        if (cancelled) return;

        await dispatch(fetchRelay(date)).unwrap();
        if (cancelled) return;

        setEventsLoading(false);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setTempLoading(false);
          setFertLoading(false);
          setEventsLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [dispatch, selectedDate]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
    plugins: {
      legend: {
        labels: { color: '#e2e8f0' },
        onClick: (e, item, legend) => {
          const chart = legend.chart;
          const label = item.text;
          const datasetIndex = item.datasetIndex;

          if (label === 'HEAT' || label === 'COOL') {
            setRelayVisible(prev => ({
              ...prev,
              [label]: !prev[label],
            }));
            chart.update();
            return;
          }

          if (datasetIndex !== undefined) {
            chart.setDatasetVisibility(
              datasetIndex,
              !chart.isDatasetVisible(datasetIndex)
            );
            chart.update();
          }
        },
      },
      zoom: {
        pan: { enabled: true, mode: 'x' },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: 'x',
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        ticks: { color: '#94a3b8' },
        grid: { color: '#1e293b' },
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: '#1e293b' },
      },
    },
  };

  const reset = () => {
    fertRef.current?.resetZoom();
    tempRef.current?.resetZoom();
    eventsRef.current?.resetZoom();
  };

  const fertiliserDatasets = [
    { label: 'NO3', data: events.doser[1], borderColor: '#3b82f6', borderWidth: 2, tension: 0.3 },
    { label: 'PO4', data: events.doser[2], borderColor: '#22c55e', borderWidth: 2, tension: 0.3 },
    { label: 'Micro1', data: events.doser[3], borderColor: '#f59e0b', borderWidth: 2, tension: 0.3 },
    { label: 'Micro2', data: events.doser[4], borderColor: '#ef4444', borderWidth: 2, tension: 0.3 },
  ];

  const relayDatasets = [
    { label: 'CO2', data: events.relay[1], borderColor: '#3b82f6', borderWidth: 2, tension: 0 },
    { label: 'O2', data: events.relay[2], borderColor: '#22c55e', borderWidth: 2, tension: 0 },
    { label: 'Filter', data: events.relay[3], borderColor: '#f59e0b', borderWidth: 2, tension: 0 },
    { label: 'Lightning cooling', data: events.relay[4], borderColor: '#ef4444', borderWidth: 2, tension: 0 },
    { label: 'ARGB', data: events.relay[5], borderColor: '#8400ff', borderWidth: 2, tension: 0 },
  ];

  const tempDatasets = [
    { label: 'Water', data: metrics.water_temp, borderColor: '#38bdf8', borderWidth: 2, tension: 0.3, pointRadius: 1 },
    { label: 'Air', data: metrics.air_temp, borderColor: '#a78bfa', borderWidth: 2, tension: 0.3, pointRadius: 1 },
    { label: 'Humidity', data: metrics.humidity, borderColor: '#17fb49', borderWidth: 2, tension: 0.3, pointRadius: 1, hidden: true },
  ];

  return (
    <Page className={classNames(cls.archivePage, {}, [])}>
      <section className={cls.content}>
        <div className={cls.wrapper}>
          <div className={cls.page}>
            <div className={cls.controls}>
              <input
                className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                data-bs-theme="dark"
                id="onTime"
                type="date"
                {...register('date', {
                  required: '',
                  validate: validateDate,
                })}
              />
              <button className={'btn btn-outline-danger'} onClick={reset}>
                Reset
              </button>
            </div>

            <div className={cls.grid}>
              <div className={cls.card}>
                <h3>Temperature + Relays</h3>

                {tempLoading ? (
                  <ChartSkeleton
                    title="Temperature data"
                    subtitle="Loading metrics and PID markers..."
                  />
                ) : (
                  <div className={cls.chart}>
                    <Line
                      ref={tempRef}
                      options={{
                        ...options,
                        plugins: {
                          ...options.plugins,
                          relayMarkersPlugin: {
                            events: events.pid,
                            visible: relayVisible,
                          },
                        },
                      }}
                      data={{
                        datasets: [
                          ...tempDatasets,
                          { label: 'HEAT', data: [], borderColor: '#ef4444' },
                          { label: 'COOL', data: [], borderColor: '#38bdf8' },
                        ],
                      }}
                    />
                  </div>
                )}
              </div>

              <div className={cls.card}>
                <h3>Fertilizers</h3>

                {fertLoading ? (
                  <ChartSkeleton
                    title="Doser events"
                    subtitle="Loading fertilizer history..."
                  />
                ) : (
                  <div className={cls.chart}>
                    <Line
                      ref={fertRef}
                      options={options}
                      data={{ datasets: fertiliserDatasets }}
                    />
                  </div>
                )}
              </div>

              <div className={cls.card}>
                <h3>Events</h3>

                {eventsLoading ? (
                  <ChartSkeleton
                    title="Relay events"
                    subtitle="Loading relay event history..."
                  />
                ) : (
                  <div className={cls.chart}>
                    <Line
                      ref={eventsRef}
                      options={options}
                      data={{ datasets: relayDatasets }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}