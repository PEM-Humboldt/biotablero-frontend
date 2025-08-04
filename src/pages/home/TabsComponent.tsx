import React, { useState } from "react";
import { Tabs, Tab, Box, Typography, Container } from "@mui/material";
import { TitleBar } from "pages/home/TitleBar";
import { categories, type Category } from "./CategoryData";

type TabsModulesProps = {
  activeTab: number | null;
};

// NOTE: Hay un conflicto con titleBar y el componente de titulos de los tabs
// su naturaleza es redundante, pero el uno está dependiendo de estilos
// implementados en el otro, es necesario limpiar y revisar estilos
export const TabsModules = ({ activeTab }: TabsModulesProps) => {
  const [subTab, setSubTab] = useState(0);

  const handleSubTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSubTab(newValue);
  };

  const alignClass = activeTab === 0 ? "cenefa-centrada" : "cenefa-izquierda";
  const currentCategory = activeTab !== null ? categories[activeTab] : null;

  return (
    <div id="Tabs">
      <Container maxWidth="lg" sx={{ py: 0, px: 6 }}>
        <Box sx={{ display: "flex", flexDirection: "column", height: "auto" }}>
          <TitleBar
            title={currentCategory !== null ? currentCategory.title : ""}
            alignClass={alignClass}
          />
          <Box
            id="Tab"
            sx={{
              display: "flex",
              justifyContent: activeTab === 0 ? "center" : "flex-start",
              width: "100%",
            }}
          >
            {activeTab === 0 ? (
              <Box sx={{ mt: 0 }}>
                <Typography
                  component="h1"
                  variant="h4"
                  className={activeTab === 0 ? "titulo-centrado" : ""}
                  sx={{ mb: 0, color: "white" }}
                ></Typography>
                {"content" in categories[0] && categories[0].content}
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
                <Tabs
                  orientation="vertical"
                  variant="scrollable"
                  value={subTab}
                  onChange={handleSubTabChange}
                  sx={{
                    marginTop: { xs: "77px", sm: "23px" },
                    width: { xs: "100%", sm: 290 },
                    alignSelf: "center",
                  }}
                >
                  {currentCategory !== null &&
                    "subcategories" in currentCategory &&
                    currentCategory.subcategories.map(
                      (sub: Category, index: number) => (
                        <Tab key={index} label={sub.title} />
                      )
                    )}
                </Tabs>

                <Box className="Espaciado" sx={{ flex: 1 }}>
                  <Typography
                    component="h1"
                    variant="h4"
                    sx={{
                      mb: 0,
                      color: "white",
                      textAlign: activeTab === 0 ? "center" : "left",
                    }}
                  >
                    {currentCategory !== null && currentCategory.title}
                  </Typography>
                  <Typography
                    component="div"
                    dangerouslySetInnerHTML={{
                      __html:
                        currentCategory !== null &&
                        "subcategories" in currentCategory
                          ? currentCategory.subcategories[subTab].content
                          : "",
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </div>
  );
};
