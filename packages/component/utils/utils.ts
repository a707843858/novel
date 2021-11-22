

/** 判断是否为数字 */
export const isNum = (val: any) => {
	let isNumber = false;
	if (typeof val === 'number') {
		isNumber = true;
	} else if (typeof val === 'string') {
		isNumber = !isNaN(Number(val));
	}
	return isNumber;
};

/** */
export const defindComponent =  function(name:string,context:any){
  if (customElements) {
  	if (!window.customElements.get(`n-${name}`)) {
      window.customElements.define(`n-${name}`, context);
    }
  } else {
  	throw Error("Dont't support customElements");
  }
}
