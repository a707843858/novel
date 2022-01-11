//@ts-nocheck
export default function Radio() {
  const changeHandler = () => {
    console.log('点击了');
  };

  return (
    <div>
      {/*<div className="demo-line">*/}
      {/*  <n-radio value="1" size="large" type="zoosemy">*/}
      {/*    Large*/}
      {/*  </n-radio>*/}
      {/*  <n-radio value="1" type="zoosemy">*/}
      {/*    Medium*/}
      {/*  </n-radio>*/}
      {/*  <n-radio value="1" name="a" type="zoosemy" disabled="true">*/}
      {/*    Medium Disabled*/}
      {/*  </n-radio>*/}
      {/*  <n-radio value="1" size="small" type="zoosemy">*/}
      {/*    Small*/}
      {/*  </n-radio>*/}
      {/*</div>*/}
      <div className="demo-line">
        <n-radio-group size="large" OnChange={() => changeHandler()}>
          <n-radio value="1" name="a">
            Medium
          </n-radio>
          <n-radio value="2" name="a">
            Medium
          </n-radio>
          <n-radio value="3" name="a" disabled="true">
            Medium
          </n-radio>
        </n-radio-group>
      </div>
    </div>
  );
}
