//@ts-nocheck
export default function Badge() {
  return (
    <div>
      <n-badge dot={true}>
        <n-button>A</n-button>
      </n-badge>
      <n-badge value={1}>
        <n-button>A</n-button>
      </n-badge>
      <n-badge value={2} theme="primary">
        {' '}
        <n-button>A</n-button>{' '}
      </n-badge>
      <n-badge value={3} theme="success">
        {' '}
        <n-button>A</n-button>{' '}
      </n-badge>
      <n-badge value={4} theme="info">
        <n-button>A</n-button>
      </n-badge>
      <n-badge value={5} theme="warning">
        <n-button>A</n-button>{' '}
      </n-badge>
      <n-badge value="News" type="zoosemy">
        {' '}
        <n-button>A</n-button>{' '}
      </n-badge>
      <n-badge dot={true} type="zoosemy">
        {' '}
        <n-button>A</n-button>{' '}
      </n-badge>
    </div>
  );
}
