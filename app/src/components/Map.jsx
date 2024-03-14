import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxLanguage from "@mapbox/mapbox-gl-language";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

function Map(props) {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    // 초기화
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11", // 지도 스타일
      center: [126.9779692, 37.566535], // 서울 중심 좌표로 초기값 셋팅
      zoom: 12, // 초기 지도 줌 레벨
    });

    // 언어 한글로 변경
    const language = new MapboxLanguage({ defaultLanguage: "ko" });
    map.addControl(language);

    //   map.getStyle().layers.forEach((layer) => {
    //     if (layer.type === "symbol" && layer.layout["text-field"]) {
    //       // 'text-field' 속성이 있는 모든 레이어 찾기
    //       map.setLayoutProperty(layer.id, "text-field", [
    //         "coalesce",
    //         ["get", "name_ko"], // 한국어 이름을 우선적으로 사용
    //         ["get", "name"], // 한국어 이름이 없는 경우 기본 이름 사용
    //       ]);
    //     }
    //   });

    // 지도가 로드된 후에 실행
    map.on("load", () => {
      // public 폴더 접근
      const geojsonUrl = `${process.env.PUBLIC_URL}/data/tl_scco_sig_00000.json`;

      // GeoJson 소스 추가
      map.addSource("some-geojson", {
        type: "geojson",
        data: geojsonUrl,
      });

      // GeoJSON 데이터를 기반으로 한 새 레이어 추가
      map.addLayer({
        id: "points",
        type: "line",
        source: "some-geojson",
        paint: {
          "line-color": "#800080",
        },
      });
    });

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <>
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "100vh" }}
      ></div>
    </>
  );
}

export default Map;
