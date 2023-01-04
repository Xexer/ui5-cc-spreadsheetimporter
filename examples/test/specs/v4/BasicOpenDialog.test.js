describe("Open Excel Upload dialog", () => {
	const optionsLong = {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
		hour12: true
	};
	const optionsShort = {
		month: "short",
		day: "numeric",
		year: "numeric"
	};
	before(async () => {
		FioriElementsFacade = await browser.fe.initialize({
			onTheMainPage: {
				ListReport: {
					appId: "ui.v4.ordersv4fe",
					componentId: "OrdersList",
					entitySet: "Orders"
				}
			},
			onTheDetailPage: {
				ObjectPage: {
					appId: "ui.v4.ordersv4fe",
					componentId: "OrdersObjectPage",
					entitySet: "Orders"
				}
			},
			onTheSubDetailPage: {
				ObjectPage: {
					appId: "ui.v4.ordersv4fe",
					componentId: "Orders_ItemsObjectPage",
					entitySet: "Orders_Items"
				}
			},
			onTheShell: {
				Shell: {}
			}
		});
	});

	it("should trigger search on ListReport page", async () => {
		await FioriElementsFacade.execute((Given, When, Then) => {
			Given.onTheMainPage.onFilterBar().iExecuteSearch();
			Then.onTheMainPage.onTable().iCheckRows(2);
			Then.onTheMainPage.onTable().iCheckRows({ OrderNo: "2", buyer: "jane.doe@test.com" });
			When.onTheMainPage.onTable().iPressRow({ OrderNo: "2" });
		});
	});

	it("should see an object page", async () => {
		await FioriElementsFacade.execute((Given, When, Then) => {
			Then.onTheDetailPage.onHeader().iCheckEdit();
			When.onTheDetailPage.onHeader().iExecuteEdit();
			Then.onTheDetailPage.iSeeThisPage().and.iSeeObjectPageInEditMode();
		});
	});

	it("Open ExcelUpload Dialog V4", async () => {
		await browser
			.asControl({
				selector: {
					id: "ui.v4.ordersv4fe::OrdersObjectPage--fe::CustomAction::excelUpload"
				}
			})
			.press();
		const excelUploadDialog = await browser.asControl({
			selector: {
				controlType: "sap.m.Dialog",
				properties: {
					title: "Excel Upload"
				},
				searchOpenDialogs: true
			}
		});
		expect(excelUploadDialog.isOpen()).toBeTruthy();
	});

	it("Upload file", async () => {
		const uploader = await browser.asControl({
			forceSelect: true,

			selector: {
				interaction: "root",
				controlType: "sap.ui.unified.FileUploader",
				id: "__uploader0"
			}
		});
		const fileName = "test/testFiles/TwoRowsNoErrors.xlsx"; // relative to wdio.conf.(j|t)s
		const remoteFilePath = await browser.uploadFile(fileName); // this also works in CI senarios!
		// transition from wdi5 api -> wdio api
		const $uploader = await uploader.getWebElement(); // wdi5
		const $fileInput = await $uploader.$("input[type=file]"); // wdio
		await $fileInput.setValue(remoteFilePath); // wdio
		await browser
			.asControl({
				selector: {
					controlType: "sap.m.Button",
					properties: {
						text: "Upload"
					}
				}
			})
			.press();
	});

	it("execute save", async () => {
		await FioriElementsFacade.execute((Given, When, Then) => {
			When.onTheDetailPage.onFooter().iExecuteSave();
		});
	});

	it("go to Sub Detail Page", async () => {
		await FioriElementsFacade.execute((Given, When, Then) => {
			Then.onTheDetailPage.onTable({ property: "Items" }).iCheckRows({ ID: "254" });
			When.onTheDetailPage.onTable({ property: "Items" }).iPressRow({ ID: "254" });
		});
	});

	it("check Field: Quantity", async () => {
		await FioriElementsFacade.execute((Given, When, Then) => {
			Then.onTheSubDetailPage.iSeeThisPage();
			Then.onTheSubDetailPage.onForm("OrderItems").iCheckField({ property: "quantity" }, { value: "3" });
		});
	});

	it("check Field: Product", async () => {
		await FioriElementsFacade.execute((Given, When, Then) => {
			Then.onTheSubDetailPage.onForm("OrderItems").iCheckField({ property: "title" }, { value: "Product Test 2" });
		});
	});

	it("check Field: UnitPrice", async () => {
		await FioriElementsFacade.execute((Given, When, Then) => {
			Then.onTheSubDetailPage.onForm("OrderItems").iCheckField({ property: "price" }, { value: "13.7" });
		});
	});

	it("check Field: validFrom", async () => {
		const selector = {
			selector: {
				controlType: "sap.ui.layout.form.FormElement",
				descendant: {
					controlType: "sap.m.Label",
					properties: {
						text: "validFrom"
					}
				}
			}
		};
		const formElement = await browser.asControl(selector);
		const fields = await formElement.getFields();
		const field = fields[0];
		const content = await field.getContentDisplay();
		const binding = await content.getBinding("text");
		const value = await binding.getValue();
		const date = new Date(value);
		const formattedDate = date.toLocaleString("en-US", optionsLong);
		await FioriElementsFacade.execute((Given, When, Then) => {
			Then.onTheSubDetailPage.onForm("OrderItems").iCheckField({ property: "validFrom" }, { value: formattedDate });
		});
	});

	it("check Field: timestamp", async () => {
		const selector = {
			selector: {
				controlType: "sap.ui.layout.form.FormElement",
				descendant: {
					controlType: "sap.m.Label",
					properties: {
						text: "timestamp"
					}
				}
			}
		};
		const formElement = await browser.asControl(selector);
		const fields = await formElement.getFields();
		const field = fields[0];
		const content = await field.getContentDisplay();
		const binding = await content.getBinding("text");
		const value = await binding.getValue();
		const date = new Date(value);
		const formattedDate = date.toLocaleString("en-US", optionsLong);
		await FioriElementsFacade.execute((Given, When, Then) => {
			Then.onTheSubDetailPage.onForm("OrderItems").iCheckField({ property: "timestamp" }, { value: formattedDate });
		});
	});

	it("check Field: date", async () => {
		const selector = {
			selector: {
				controlType: "sap.ui.layout.form.FormElement",
				descendant: {
					controlType: "sap.m.Label",
					properties: {
						text: "date"
					}
				}
			}
		};
		const formElement = await browser.asControl(selector);
		const fields = await formElement.getFields();
		const field = fields[0];
		const content = await field.getContentDisplay();
		const binding = await content.getBinding("text");
		const value = await binding.getValue();
		const date = new Date(value);
		const formattedDate = date.toLocaleString("en-US", optionsShort);
		await FioriElementsFacade.execute((Given, When, Then) => {
			Then.onTheSubDetailPage.onForm("OrderItems").iCheckField({ property: "date" }, { value: formattedDate });
		});
	});

	it("check Field: time", async () => {
		await FioriElementsFacade.execute((Given, When, Then) => {
			Then.onTheSubDetailPage.onForm("OrderItems").iCheckField({ property: "time" }, { value: "4:00:00 PM" });
		});
	});
});
