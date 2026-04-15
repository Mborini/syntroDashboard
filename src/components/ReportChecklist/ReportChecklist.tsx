"use client";

import { Stack, Radio, Textarea, Paper, Title } from "@mantine/core";
import { useEffect, useState } from "react";

export type ChecklistData = {
  shift: string;
  trips: number | null;

  completedRoute: boolean | null;
  followedRoute: boolean | null;
  hasDeviation: boolean | null;
  outsideArea: boolean | null;
  hasUncollectedBins: boolean | null;

  noTripsReason: string;
  unCompletedRouteReason: string;
  unFollowedRouteReason: string;
  deviationReason: string;

  outsideAreaReason: string;
  locationOutsideArea: string;

  uncollectedBinsReason: string;
  uncollectedBinsApproxCount: number | null;

  notes: string;
};

type Props = {
  onChange: (data: ChecklistData, isValid: boolean) => void;
};

export default function ReportChecklist({ onChange }: Props) {
  const [data, setData] = useState<ChecklistData>({
    shift: "",
    trips: null,

    completedRoute: null,
    followedRoute: null,
    hasDeviation: null,
    outsideArea: null,
    hasUncollectedBins: null,

    noTripsReason: "",
    unCompletedRouteReason: "",
    unFollowedRouteReason: "",
    deviationReason: "",

    outsideAreaReason: "",
    locationOutsideArea: "",

    uncollectedBinsReason: "",
    uncollectedBinsApproxCount: null,

    notes: "",
  });

  const handleChange = <K extends keyof ChecklistData>(
    key: K,
    value: ChecklistData[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const isValid =
    data.shift !== "" &&
    data.trips !== null &&
    data.completedRoute !== null &&
    data.followedRoute !== null &&
    data.hasDeviation !== null &&
    data.outsideArea !== null;

  useEffect(() => {
    onChange(data, isValid);
  }, [data]);

  return (
    <Paper withBorder p="md" radius="md">
      <Title order={5} mb="md">
        Checklist
      </Title>

      <Stack>
        {/* SHIFT */}
        <Radio.Group
          label="Shift"
          value={data.shift}
          onChange={(v) => handleChange("shift", v)}
        >
          <Radio value="A" label="A" />
          <Radio value="B" label="B" />
          <Radio value="C" label="C" />
        </Radio.Group>

        {/* TRIPS */}
        <Radio.Group
          label="Trips"
          value={data.trips?.toString() || ""}
          onChange={(v) => handleChange("trips", Number(v))}
        >
          <Radio value="0" label="0" />
          <Radio value="1" label="1" />
          <Radio value="2" label="2" />
          <Radio value="3" label="3" />
          <Radio value="4" label="4" />
        </Radio.Group>

        {data.trips === 0 && (
          <Textarea
            label="No trips reason"
            value={data.noTripsReason}
            onChange={(e) =>
              handleChange("noTripsReason", e.currentTarget.value)
            }
          />
        )}

        {/* COMPLETED ROUTE */}
        <Radio.Group
          label="Completed route?"
          value={
            data.completedRoute === null ? "" : String(data.completedRoute)
          }
          onChange={(v) => handleChange("completedRoute", v === "true")}
        >
          <Radio value="true" label="Yes" />
          <Radio value="false" label="No" />
        </Radio.Group>

        {data.completedRoute === false && (
          <Textarea
            label="Uncompleted route reason"
            value={data.unCompletedRouteReason}
            onChange={(e) =>
              handleChange("unCompletedRouteReason", e.currentTarget.value)
            }
          />
        )}

        {/* FOLLOWED ROUTE */}
        <Radio.Group
          label="Followed route?"
          value={
            data.followedRoute === null ? "" : String(data.followedRoute)
          }
          onChange={(v) => handleChange("followedRoute", v === "true")}
        >
          <Radio value="true" label="Yes" />
          <Radio value="false" label="No" />
        </Radio.Group>

        {data.followedRoute === false && (
          <Textarea
            label="Unfollowed route reason"
            value={data.unFollowedRouteReason}
            onChange={(e) =>
              handleChange("unFollowedRouteReason", e.currentTarget.value)
            }
          />
        )}

        {/* DEVIATION */}
        <Radio.Group
          label="Deviation?"
          value={data.hasDeviation === null ? "" : String(data.hasDeviation)}
          onChange={(v) => handleChange("hasDeviation", v === "true")}
        >
          <Radio value="true" label="Yes" />
          <Radio value="false" label="No" />
        </Radio.Group>

        {data.hasDeviation === true && (
          <Textarea
            label="Deviation reason"
            value={data.deviationReason}
            onChange={(e) =>
              handleChange("deviationReason", e.currentTarget.value)
            }
          />
        )}

        {/* OUTSIDE AREA */}
        <Radio.Group
          label="Outside area?"
          value={data.outsideArea === null ? "" : String(data.outsideArea)}
          onChange={(v) => handleChange("outsideArea", v === "true")}
        >
          <Radio value="true" label="Yes" />
          <Radio value="false" label="No" />
        </Radio.Group>

        {data.outsideArea === true && (
          <>
            <Textarea
              label="Outside area reason"
              value={data.outsideAreaReason}
              onChange={(e) =>
                handleChange("outsideAreaReason", e.currentTarget.value)
              }
            />
            <Textarea
              label="Location"
              value={data.locationOutsideArea}
              onChange={(e) =>
                handleChange("locationOutsideArea", e.currentTarget.value)
              }
            />
          </>
        )}

        {/* UNCLECTED BINS */}
        <Radio.Group
          label="Uncollected bins?"
          value={
            data.hasUncollectedBins === null
              ? ""
              : String(data.hasUncollectedBins)
          }
          onChange={(v) => handleChange("hasUncollectedBins", v === "true")}
        >
          <Radio value="true" label="Yes" />
          <Radio value="false" label="No" />
        </Radio.Group>

        {data.hasUncollectedBins === true && (
          <>
            <Textarea
              label="Reason"
              value={data.uncollectedBinsReason}
              onChange={(e) =>
                handleChange("uncollectedBinsReason", e.currentTarget.value)
              }
            />
            <Textarea
              label="Approx count"
              value={data.uncollectedBinsApproxCount?.toString() || ""}
              onChange={(e) =>
                handleChange(
                  "uncollectedBinsApproxCount",
                  Number(e.currentTarget.value)
                )
              }
            />
          </>
        )}

        {/* NOTES */}
        <Textarea
          label="Notes"
          value={data.notes}
          onChange={(e) => handleChange("notes", e.currentTarget.value)}
        />
      </Stack>
    </Paper>
  );
}