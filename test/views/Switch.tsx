//@ts-nocheck
export default function Switch() {
  return (
    <div>
      <div className="demo-line">
        <n-switch type="zoosemy" size="small">
          1
        </n-switch>
        <n-switch type="zoosemy">1</n-switch>
        <n-switch type="zoosemy" size="large">
          1
        </n-switch>
        <n-switch type="zoosemy" disabled="true" value="true">
          1
        </n-switch>
        <n-switch
          type="zoosemy"
          disabled="true"
          value="true"
          activeText="开"
          inactiveText="关"
        >
          1
        </n-switch>
        <n-switch activeText="开" inactiveText="关">
          1
        </n-switch>
      </div>
    </div>
  );
}
