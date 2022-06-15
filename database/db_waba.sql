-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.27 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.0.0.6468
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table db_waba.waba_nasabah
CREATE TABLE IF NOT EXISTS `waba_nasabah` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `hp` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table db_waba.waba_nasabah: ~1,000 rows (approximately)
INSERT INTO `waba_nasabah` (`id`, `name`, `hp`) VALUES
	(1, 'Chairil', '081316451182');

-- Dumping structure for table db_waba.waba_templates
CREATE TABLE IF NOT EXISTS `waba_templates` (
  `id` int NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `message` text CHARACTER SET latin1 COLLATE latin1_swedish_ci,
  `status` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table db_waba.waba_templates: ~0 rows (approximately)
INSERT INTO `waba_templates` (`id`, `name`, `message`, `status`) VALUES
	(1, 'Broadcast Message', '*Selamat Pagi {1},*\r\n\r\nTidak terasa 28th sudah *KREDIT PLUS* membantu serta melayani segala kebutuhan kamu. *Dalam rangka ulang tahun yang ke 28, KREDITPLUS* memberikan *kemudahan pembiayaan multiguna* langsung dari rumah, cukup beberapa langkah pengajuan kamu sudah bisa kami proses.\r\n \r\nIngin tau kelanjutannya? tunggu yaa, staff kami akan menghubungi.', 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
