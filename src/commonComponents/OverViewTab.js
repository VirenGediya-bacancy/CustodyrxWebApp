import React from "react";
import { Row as RowDetail } from "./Row";

export default function OverViewTab({ OverViewTabsData }) {
  return (
    <>
      {OverViewTabsData.map((data) =>
        data.type === "image" ? (
          <div className="drug-detail-action">
            {data.value ? (
              <img src={data.value}></img>
            ) : (
              <img src="https://fakeimg.pl/640x360"></img>
            )}
          </div>
        ) : (
          <RowDetail name={data.name} value={data.value}></RowDetail>
        )
      )}
    </>
  );
}
