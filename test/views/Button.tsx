//@ts-nocheck
export default function Button() {
  return (
    <div>
      <div className="demo-line">
        <n-button size="large">Large</n-button>
        <n-button size="medium">Medium</n-button>
        <n-button size="small">Small</n-button>
      </div>
      <div className="demo-line">
        <n-button>Normal</n-button>
        <n-button theme="primary">Primary</n-button>
        <n-button theme="primary" disabled="true">
          Disabled
        </n-button>
      </div>
      <div className="demo-line">
        <n-button type="zoosemy">Normal</n-button>
        <n-button type="zoosemy" circle={true}>
          A
        </n-button>
        <n-button theme="primary" type="zoosemy" disabled={true}>
          Primary
        </n-button>
        <n-button theme="primary" type="zoosemy" round={true}>
          Round
        </n-button>
        <n-button theme="primary" type="zoosemy" disabled={true}>
          Disabled
        </n-button>
      </div>
    </div>
  );
}
